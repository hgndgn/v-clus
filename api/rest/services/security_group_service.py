# security_group_service.py

import logging

from botocore.exceptions import ClientError

from config.default import AWS_REGION_NAME
from .log_service import Logger
from ..boto import ec2_resource, ec2_client

logger = Logger("security_group_service.log", logging.DEBUG).logger


class SecGroupService:
  def __init__(self):
    self.region = AWS_REGION_NAME
    self.resource = ec2_resource()
    self.client = ec2_client()

  def with_region(self, region):
    self.region = region or AWS_REGION_NAME
    self.resource = ec2_resource(self.region)
    self.client = ec2_client(self.region)
    return self

  def describe_security_groups(self, group_ids=[]):
    return self.client.describe_security_groups(GroupIds=group_ids)

  def create_security_group(self, name, description, vpc_id):
    try:
      group = self.resource.create_security_group(
          GroupName=name, Description=description, VpcId=vpc_id)
      return group
    except ClientError as e:
      logger.error(str(e))
      raise e

  def delete_security_group(self, group_id):
    try:
      self.client.delete_security_group(GroupId=group_id)
      return group_id
    except ClientError as e:
      logger.error(str(e))
      raise e

  def change_inbound_rules(self, group_id, ip_permissions):
    if len(ip_permissions) == 0:
      return

    try:
      self.client.authorize_security_group_ingress(
          GroupId=group_id, IpPermissions=ip_permissions)
    except ClientError as e:
      logger.error(str(e))
      raise e

  def change_outbound_rules(self, group_id, ip_permissions):
    if len(ip_permissions) == 0:
      return

    try:
      self.client.authorize_security_group_egress(
          GroupId=group_id, IpPermissions=ip_permissions)
    except ClientError as e:
      logger.error(str(e))
      raise e

  def create_group_and_add_rules(self, group, inbound_rules, outbound_rules):
    try:
      def ip_permission(rule, is_inbound): return {
          "FromPort": rule["fromPort"],
          "ToPort": rule["toPort"],
          "IpRanges": [
              {
                  "CidrIp": rule["source"] if is_inbound else rule["destination"],
                  "Description": rule["description"]
              }
          ],
          "IpProtocol": rule["protocol"]
      }

      group_id = self.create_security_group(
          group["name"], group["description"], group["vpcId"]).id

      if len(inbound_rules) > 0:
        in_rules = []

        for r in inbound_rules:
          in_rules.append(ip_permission(r, True))

        self.change_inbound_rules(group_id, in_rules)

      if len(outbound_rules) > 0:
        out_rules = []

        for r in outbound_rules:
          out_rules.append(ip_permission(r, False))

        self.change_outbound_rules(group_id, out_rules)
    except ClientError as e:
      try:
        self.delete_security_group(group_id)
      except:
        pass
      raise e
