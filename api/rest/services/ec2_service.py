# ec2_service.py

import logging

from pydash import has
from botocore.exceptions import ClientError
from config.default import AWS_REGION_NAME

from .log_service import Logger
from .keypair_service import KeyPairService
from ..boto import ec2_resource, ec2_client

log = Logger("ec2Service.log", logging.DEBUG).logger
keypair_service = KeyPairService()


class Ec2Service():
  def __init__(self):
    self.region = AWS_REGION_NAME
    self.resource = ec2_resource()
    self.client = ec2_client()

  def with_region(self, region):
    self.region = region
    self.resource = ec2_resource(region)
    self.client = ec2_client(region)
    return self

  def start_instance(self, instance_id):
    try:
      log.info(f"Starting instance {instance_id}")
      ec2 = self.resource.Instance(instance_id)
      ec2.start()
      ec2.wait_until_running()
      return instance_id
    except Exception as e:
      log.error(str(e))
      raise e

  def stop_instance(self, instance_id):
    try:
      log.info(f"Stopping instance {instance_id}")
      ec2 = self.resource.Instance(instance_id)
      ec2.stop()
      ec2.wait_until_stopped()
      return instance_id
    except Exception as e:
      log.error(str(e))
      raise e

  def terminate_instance(self, instance_id):
    try:
      log.info(f"Terminating instance {instance_id}")
      ec2 = self.resource.Instance(instance_id)

      # release the elastic ip before terminating
      ip_address = self.instance_public_ip(instance_id) or None
      if ip_address:
        self.release_elastic_ip(ip_address)

      ec2.terminate()
      ec2.wait_until_terminated()
      return instance_id
    except Exception as e:
      log.error(str(e))
      raise e

  def describe_instances(self, filters=[], instance_ids=[]):
    try:
      return self.client.describe_instances(
          Filters=filters, InstanceIds=instance_ids)
    except ClientError as e:
      log.error(str(e))
      raise e

  def extract_raw_instances(self, aws_describe_responses_result):
    if has(aws_describe_responses_result, "Reservations"):
      reservations = aws_describe_responses_result["Reservations"]
      if len(reservations) > 0:
        if has(reservations[0], "Instances"):
          return reservations[0]["Instances"]

    return []

  def get_amazon_image_ids(self):
    owners = ["amazon"]
    filters = [{"Name": "name", "Values": ["amzn2-ami-hvm-2.0.????????.?-x86_64-gp2", "available"]}]
    images = self.client.describe_images(Owners=owners, Filters=filters)["Images"]
    return images

  def instance_public_ip(self, instance_id):
    filters = [{
        "Name": "instance-id",
        "Values": [instance_id]
    }]

    result = self.client.describe_instances(
        Filters=filters, InstanceIds=[instance_id])

    instances = self.extract_raw_instances(result)
    if len(instances) > 0:
      if has(instances[0]["NetworkInterfaces"][0], "Association"):
        return result["Reservations"][0]["Instances"][0]["NetworkInterfaces"][0]["Association"]["PublicIp"]

  def release_elastic_ip(self, ip_address):
    try:
      filters = [{'Name': 'domain', 'Values': ['vpc']}]

      elastic_ips = self.client.describe_addresses(Filters=filters)

      if has(elastic_ips, ip_address):
        elastic_ips = self.client.describe_addresses(
            Filters=filters, PublicIps=[ip_address])

        for ei in elastic_ips["Addresses"]:
          if (ei["PublicIp"] == ip_address):
            self.client.release_address(
                AllocationId=ei["AllocationId"])
    except ClientError as e:
      raise e

  def instance_state(self, instance_id):
    try:
      res = self.client.describe_instance_status(
          InstanceIds=[instance_id])
      return res["InstanceStatuses"][0]["InstanceState"]["Name"]
    except ClientError as e:
      log.error(str(e))
      raise e

  def security_groups_of_instances(self, instance_ids):
    try:
      descriptions = self.describe_instances(instance_ids=instance_ids)
      res = []

      for r in descriptions["Reservations"]:
        for i in r["Instances"]:
          for ni in i["NetworkInterfaces"]:
            groups = list(
                map(lambda x: x["GroupId"], ni["Groups"]))
            res.append({
                "vpcId": i["VpcId"],
                "instanceId": i["InstanceId"],
                "securityGroups": groups
            })

      return res
    except Exception as e:
      log.error(str(e))
      raise e

  def create_instances(self, vclus_vpcs):
    created_ec2_ids = []

    try:
      log.info("[CREATE_INSTANCES] - {vclus_vpcs}")

      for vpc in vclus_vpcs:
        for subnet in vpc["subnets"]:
          for instance in subnet["instances"]:
            subnet_of_instance = self.resource.Subnet(instance["subnetId"])

            keypair_option = instance["keyPairOption"]
            keyname = instance["keyname"]

            if keypair_option in ["CREATE", "SELECT"]:
              if keypair_option == "CREATE":
                keyname = keypair_service.create_key_pair(keyname)

              created_instances = subnet_of_instance.create_instances(ImageId=instance["imageId"], InstanceType=instance["type"],
                                                                      MinCount=instance["amount"], MaxCount=instance["amount"], KeyName=keyname)

            else:
              created_instances = subnet_of_instance.create_instances(ImageId=instance["imageId"], InstanceType=instance["type"],
                                                                      MinCount=instance["amount"], MaxCount=instance["amount"])

            created_ec2_ids.extend([r.id for r in created_instances])

            for aws_instance in created_instances:
              if len(instance["securityGroups"]) > 0:
                aws_instance.modify_attribute(
                    Groups=instance["securityGroups"])

      return created_ec2_ids
    except ClientError as e:
      log.error(str(e))

      log.info('Rollback: terminating instances...')

      for i in created_ec2_ids:
        self.terminate_instance(i)
      raise e
