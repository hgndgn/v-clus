# boto.py

import boto3

from config.default import AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION_NAME

def ec2_resource(region=None):
  return boto3.resource(
      service_name="ec2",
      aws_access_key_id=AWS_ACCESS_KEY_ID,
      aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
      region_name=region or AWS_REGION_NAME
  )

def ec2_client(region=None):
  return boto3.client(
      service_name="ec2",
      aws_access_key_id=AWS_ACCESS_KEY_ID,
      aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
      region_name=region or AWS_REGION_NAME
  )
