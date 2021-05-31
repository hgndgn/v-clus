# vpc_service.py


import logging

from botocore.exceptions import ClientError
from config.default import AWS_REGION_NAME

from rest.models import ErrorCode

from .log_service import Logger
from .ec2_service import Ec2Service
from ..boto import ec2_resource, ec2_client

logger = Logger("vpc_service.log", logging.DEBUG).logger

ec2_service = Ec2Service()


class VpcService:
  def __init__(self):
    self.region = AWS_REGION_NAME
    self.resource = ec2_resource()
    self.client = ec2_client()

  def with_region(self, region):
    self.region = region or AWS_REGION_NAME
    self.resource = ec2_resource(self.region)
    self.client = ec2_client(self.region)
    return self

  def describe_subnets(self):
    try:
      return self.client.describe_subnets()
    except ClientError as e:
      logger.error(str(e))
      raise e

  def create_vpc(self, name, cidr):
    try:
      vpc = self.resource.create_vpc(CidrBlock=cidr)
      if name:
        vpc.create_tags(Tags=[{"Key": "Name", "Value": name}])
      return vpc
    except ClientError as e:
      logger.error(str(e))
      raise e

  def delete_vpc(self, vpc_id):
    # see: https://gist.github.com/vernhart/c6a0fc94c0aeaebe84e5cd6f3dede4ce
    try:
      vpc = self.resource.Vpc(vpc_id)

      filters = [{
          'Name': 'vpc-id',
          'Values': [vpc.id]
      }]

      aws_result = ec2_service.describe_instances(filters=filters)
      instances = ec2_service.extract_raw_instances(aws_result)

      [ec2_service.terminate_instance(instance["InstanceId"]) for instance in instances]

      for gw in vpc.internet_gateways.all():
        vpc.detach_internet_gateway(InternetGatewayId=gw.id)
        gw.delete()

      for rt in vpc.route_tables.all():
        for rta in rt.associations_attribute:
          if not rta["Main"]:
            self.resource.disassociate_route_table(
                AssociationId=rta["RouteTableAssociationId"])
            rta.delete()

      for subnet in vpc.subnets.all():
        for instance in subnet.instances.all():
          instance.terminate()

      for ep in self.client.describe_vpc_endpoints(
              Filters=filters)['VpcEndpoints']:
        self.client.delete_vpc_endpoints(
            VpcEndpointIds=[ep['VpcEndpointId']])

      for sg in vpc.security_groups.all():
        if sg.group_name != 'default':
          sg.delete()

      for vpcpeer in self.client.describe_vpc_peering_connections(
              Filters=[{
                  'Name': 'requester-vpc-info.vpc-id',
                  'Values': [vpc.id]
              }])['VpcPeeringConnections']:
        self.resource.VpcPeeringConnection(
            vpcpeer['VpcPeeringConnectionId']).delete()

      for netacl in vpc.network_acls.all():
        if not netacl.is_default:
          netacl.delete()

      for subnet in vpc.subnets.all():
        for interface in subnet.network_interfaces.all():
          interface.delete()
        subnet.delete()

      vpc.delete()

      return vpc_id
    except Exception as e:
      logger.error(str(e))
      raise e

  def create_subnet(self, name, cidr, vpc_id):
    try:
      subnet = self.resource.create_subnet(
          AvailabilityZone=self.region + "a",
          CidrBlock=cidr,
          VpcId=vpc_id
      )
      subnet.create_tags(Tags=[{"Key": "Name", "Value": name}])
      return subnet.id
    except ClientError as e:
      logger.error(str(e))
      raise e

  def delete_subnet(self, subnet_id):
    try:
      self.client.delete_subnet(SubnetId=subnet_id)
      return subnet_id
    except ClientError as e:
      logger.error(str(e))
      raise e

  def describe_vpcs(self, filters=[], vpcs_ids=[]):
    try:
      res = self.client.describe_vpcs(Filters=filters, VpcIds=vpcs_ids)
      return res
    except ClientError as e:
      raise e

  def get_subnets_of_vpc(self, vpc_id):
    def props(s): return {
        "id": s.id,
        "cidrBlock": s.cidr_block,
        "vpcId": s.vpc_id
    }

    vpc = self.resource.Vpc(vpc_id)
    subnets = list(vpc.subnets.all())
    return list(map(props, subnets))

  def describe_internet_gateways(self, filters=[], gateway_ids=[]):
    try:
      return self.client.describe_internet_gateways(Filters=filters, InternetGatewayIds=gateway_ids)
    except ClientError as e:
      logger.error(str(e))
      raise e

  def describe_route_tables(self, vpc_id):
    res = self.client.describe_route_tables(
        Filters=[
            {
                'Name': 'vpc-id',
                'Values': [vpc_id]
            },
        ]
    )

    return res

  def get_route_tables(self, vpc_id):
    res = self.describe_route_tables(vpc_id)
    res = list(map(lambda x: x["RouteTableId"], res["RouteTables"]))
    return res

  def create_internet_gateway(self):
    try:
      gateway = self.resource.create_internet_gateway()
      return gateway
    except ClientError as e:
      logger.error(str(e))
      raise e

  def has_internet_gateway(self, vpc_id):
    filters = [{
        'Name': 'attachment.vpc-id',
        'Values': [vpc_id]
    }]

    res = self.describe_internet_gateways(filters=filters)
    return len(res['InternetGateways']) > 0

  def associate_ip_address(self, instance_id, allocation_id):
    try:
      instance = self.resource.Instance(instance_id)
      instance.wait_until_running()
      self.client.associate_address(AllocationId=allocation_id,
                                    InstanceId=instance_id)
      return ErrorCode.NO_ERR
    except ClientError as e:
      logger.error(str(e))
      raise e

  def allocate_and_associate_elastic_ip(self, instance_id):
    try:
      allocation_id = self.client.allocate_address(Domain='vpc')[
          "AllocationId"]
      association_id = self.associate_ip_address(
          instance_id, allocation_id)
      return association_id
    except ClientError as e:
      logger.error(str(e))
      raise e
