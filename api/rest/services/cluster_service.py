# cluster_service.py

import traceback
import logging
import json
import threading
from flask.globals import request

from pydash import is_empty
from config.default import AWS_REGION_NAME

from rest import db
from rest.models import Cluster

from .log_service import Logger
from .ec2_service import Ec2Service
from .vpc_service import VpcService
from .security_group_service import SecGroupService
from .keypair_service import KeyPairService

from ..boto import ec2_resource, ec2_client

log = Logger("cluster_service.log", logging.DEBUG).logger

ec2_service = Ec2Service()
vpc_service = VpcService()
sg_service = SecGroupService()
keypair_service = KeyPairService()


def delete_cluster(cluster_id):
  try:
    Cluster.query.filter_by(id=cluster_id).delete()
    db.session.commit()
    return cluster_id
  except Exception as e:
    log.error(str(e))
    raise e


def save_cluster_to_db(name, description, cluster_json):
  cluster = Cluster(name, description, json.dumps(cluster_json))
  db.session.add(cluster)
  db.session.commit()

  log.info(f"Saving cluster: ${name}")


class ClusterService:
  def __init__(self):
    self.region = AWS_REGION_NAME
    self.resource = ec2_resource(self.region)
    self.client = ec2_client(self.region)
    """
      This object stores all created resource ids for the case doing a rollback, if a problem occurs
    """
    self.created_resources = {
        "instances": [],
        "security_groups": [],
        "subnets": [],
        "vpcs": [],
    }

  def with_region(self, region):
    self.region = region or AWS_REGION_NAME
    self.resource = ec2_resource(self.region)
    self.client = ec2_client(self.region)
    return self

  def reset_created_resources(self):
    self.created_resources = {
        "instances": [],
        "security_groups": [],
        "subnets": [],
        "vpcs": [],
    }

  def accept_any_traffic_from_cidr(self, security_group_id, cidrs_to_accept):
    def all_traffic_rule(cidr):
      return dict({
          "CidrIp": cidr,
          "Description": "-"
      })

    ip_permission = {
        "FromPort": 0,
        "ToPort": 65535,
        "IpRanges": list(map(all_traffic_rule, cidrs_to_accept)),
        "IpProtocol": "-1"
    }

    self.client.authorize_security_group_ingress(
        GroupId=security_group_id, IpPermissions=[ip_permission])

  def add_rules_to_security_group(self, group_id, rules, instances_info_map):
    rules_to_add = []

    for rule in rules:
      source_instance = rule["sourceInstanceUniqueId"]
      aws_ids = instances_info_map[source_instance]["aws_ids"]

      ip_ranges = []

      for instance_id in aws_ids:
        ip = self.get_instance_public_ip(instance_id)

        ip_ranges.append({
            "CidrIp": ip + "/32",
            "Description": rule["description"]
        })

        rules_to_add.append({
            "FromPort": rule["fromPort"],
            "ToPort": rule["toPort"],
            "IpRanges": ip_ranges,
            "IpProtocol": rule["protocol"]
        })

    # Add the rules to the security group
    self.client.authorize_security_group_ingress(
        GroupId=group_id, IpPermissions=rules_to_add)

  def assign_security_group_to_instances(self, group_id, aws_ids):
    for aws_id in aws_ids:
      aws_instance = self.resource.Instance(aws_id)
      groups = [g["GroupId"] for g in aws_instance.security_groups]
      groups.append(group_id)
      aws_instance.modify_attribute(Groups=groups)

  def create_instances(self, vclus_instance, subnet):
    keypair_option = vclus_instance["keyPairOption"]
    keyname = vclus_instance["keyname"]

    if keypair_option in ["CREATE", "SELECT"]:
      if keypair_option == "CREATE":
        keyname = keypair_service.create_key_pair(keyname)

      created_instances = subnet.create_instances(ImageId=vclus_instance["imageId"], InstanceType=vclus_instance["type"],
                                                  MinCount=vclus_instance["amount"], MaxCount=vclus_instance["amount"], KeyName=keyname)
    else:
      created_instances = subnet.create_instances(ImageId=vclus_instance["imageId"], InstanceType=vclus_instance["type"],
                                                  MinCount=vclus_instance["amount"], MaxCount=vclus_instance["amount"])

    for aws_instance in created_instances:
      self.created_resources["instances"].append(aws_instance.id)

    return created_instances

  def create_security_group(self, group_name, subnet):
    security_group = sg_service.with_region(self.region).create_security_group(
        group_name, "Created by VCLUS", subnet.vpc_id)
    self.created_resources["security_groups"].append(security_group.id)
    return security_group

  def create_security_group_and_allow_any_traffic(self, group_name, subnet, accepted_cidrs):
    security_group = self.create_security_group(group_name, subnet)

    def all_traffic_rule(cidr): return dict({
        "CidrIp": cidr,
        "Description": "-"
    })

    ip_permission = {
        "FromPort": 0,
        "ToPort": 65535,
        "IpRanges": list(map(all_traffic_rule, accepted_cidrs)),
        "IpProtocol": "-1"
    }

    self.client.authorize_security_group_ingress(
        GroupId=security_group.id, IpPermissions=[ip_permission])
    return security_group

  def get_instance_public_ip(self, instance_id):
    return ec2_service.with_region(self.region).instance_public_ip(instance_id)

  def get_virtual_clusters(self):
    try:
      res = Cluster.query.all()
      return list(map(lambda n: n.json(), res))
    except Exception as e:
      log.error(str(e))
      raise e

  def use_public_ip_in_subnet(self, subnet):
    self.client.modify_subnet_attribute(
        MapPublicIpOnLaunch={'Value': True}, SubnetId=subnet.id)

  def create_virtual_cluster(self, data):
    instances_info_map = dict()

    try:
      save_cluster = data["saveCluster"]
      vclus_vpcs = data["cluster"]

      """
        1. Iteration: Creating resources
      """
      log.info("\t*  Creating resources")
      log.info("\t*  Creating VPCs")
      for vclus_vpc in vclus_vpcs:
        # Create VPC with tag
        new_vpc = vpc_service.create_vpc(vclus_vpc["name"], vclus_vpc["cidr"])
        self.created_resources["vpcs"].append(new_vpc.id)

        new_vpc.create_tags(
            Tags=[{
                "Key": "Name",
                "Value": vclus_vpc["name"]
            }]
        )

        log.info(f"\t*  Creating subnets in {new_vpc.id}")

        for vclus_subnet in vclus_vpc["subnets"]:
          # Create subnet with tag
          new_subnet = new_vpc.create_subnet(CidrBlock=vclus_subnet["cidr"])
          self.created_resources["subnets"].append(new_subnet.id)

          new_subnet.create_tags(
              Tags=[{
                  "Key": "Name",
                  "Value": vclus_subnet["name"]
              }]
          )

          self.use_public_ip_in_subnet(new_subnet)

          subnet_security_group = None
          accepted_cidrs = vclus_subnet["acceptedSubnetCidrs"]
          if len(accepted_cidrs) > 0:
            group_name = f"VCLUS - vpc_{vclus_subnet['vpcId']} / subnet_{vclus_subnet['id']}"
            subnet_security_group = self.create_security_group_and_allow_any_traffic(
                group_name, new_subnet, accepted_cidrs)

          log.info(f"\t*  Launching instances in subnet {new_subnet.id}")
          for vclus_instance in vclus_subnet["instances"]:
            new_instances = self.create_instances(vclus_instance, new_subnet)

            if subnet_security_group:
              for aws_instance in new_instances:
                aws_instance.modify_attribute(
                    Groups=[subnet_security_group.id])

            group_name = f"VCLUS - v_{vclus_instance['vpcId']} / s_{vclus_instance['subnetId']} / i_{vclus_instance['id']}"
            inbound_rules_security_group = self.create_security_group(
                group_name, new_subnet)

            ec2_id = vclus_instance["uniqueId"]
            instances_info_map[ec2_id] = {
                "aws_ids": [ec2.id for ec2 in new_instances],
                "inbound_rules_security_group_id": inbound_rules_security_group.id,
            }

      """
        2. Iteration: Configure interconnections and assign Security Groups 
      """
      log.info("\t*  Configure interconnections and assign Security Groups")

      for vclus_vpc in vclus_vpcs:
        for vclus_subnet in vclus_vpc["subnets"]:
          for vclus_instance in vclus_subnet["instances"]:
            inbound_rules = vclus_instance["interconnections"]["inboundRules"]

            if is_empty(inbound_rules):
              continue

            # Add inbound rules to the security group
            ec2_id = vclus_instance["uniqueId"]
            instance_info = instances_info_map[ec2_id]
            group_id = instance_info["inbound_rules_security_group_id"]
            self.add_rules_to_security_group(
                group_id, inbound_rules, instances_info_map)

            # Assign the security group for the inbound rules to the corresponding instances
            group_id = instance_info["inbound_rules_security_group_id"]
            aws_ids = instance_info["aws_ids"]
            self.assign_security_group_to_instances(group_id, aws_ids)

      if save_cluster:
        name = data["clusterName"]
        description = data["clusterDescription"] or "-"
        save_cluster_to_db(name, description, vclus_vpcs)

      self.reset_created_resources()
    except Exception as e:
      def rollback():
        try:
          log.info(
              f"Instances to terminate: {self.created_resources['instances']}")
          for iid in self.created_resources["instances"]:
            ec2 = self.resource.Instance(iid)
            ec2.terminate()
            ec2.wait_until_terminated()

          log.info("Delete Security Groups:")
          for group in self.created_resources["security_groups"]:
            self.client.delete_security_group(GroupId=group)

          log.info("Delete Subnets:")
          for subnet in self.created_resources["subnets"]:
            log.info(f"\t*Deleteing NetworkInterface of {subnet}:")

            try:
              filters = [
                  {
                      'Name': 'subnet-id',
                      'Values': [subnet]
                  },
              ]
              network_interfaces = self.client.describe_network_interfaces(
                  Filters=filters)

              for ni in network_interfaces["NetworkInterfaces"]:
                net_id = ni['NetworkInterfaceId']
                log.info(f"\t\t-Delete NI {net_id}")
                self.client.delete_network_interface(NetworkInterfaceId=net_id)
            except Exception as e:
              log.error(str(e))

            self.client.delete_subnet(SubnetId=subnet)

          log.info("Delete VPCs:")
          for vpc_id in self.created_resources["vpcs"]:
            log.info(f"\t*Deleting {vpc_id}:")
            self.client.delete_vpc(VpcId=vpc_id)
        except Exception:
          log.error(str(traceback.format_exc()))
        finally:
          self.reset_created_resources()

      log.error(str(traceback.format_exc()))
      log.info("Rollback...")

      rb_thread = threading.Thread(target=rollback, daemon=True)
      rb_thread.start()
      rb_thread.join()

      raise e
