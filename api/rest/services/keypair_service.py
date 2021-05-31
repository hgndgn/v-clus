# keypair_service.py

import logging

from botocore.exceptions import ClientError
from config.default import AWS_REGION_NAME
from pydash import is_empty

from rest import db
from rest.models import KeyPair
from .log_service import Logger

from ..boto import ec2_resource, ec2_client

log = Logger("keypair_service.log", logging.DEBUG).logger


class KeyPairService():
  def __init__(self):
    self.region = AWS_REGION_NAME
    self.resource = ec2_resource()
    self.client = ec2_client()

  def with_region(self, region):
    self.region = region
    self.resource = ec2_resource(region)
    self.client = ec2_client(region)
    return self

  def create_key_pair(self, keyname):
    try:
      res = self.client.create_key_pair(KeyName=keyname)
      keyname = res["KeyName"]
      keypair = KeyPair(keyname, res["KeyMaterial"], res["KeyFingerprint"])
      db.session.add(keypair)
      db.session.commit()

      log.info(f"create key pair: ${keyname}")
      return keyname
    except ClientError as e:
      log.error(str(e))
      raise e

  def delete_key_pair(self, keyname):
    try:
      self.client.delete_key_pair(KeyName=keyname)
      keypair = KeyPair.query.filter_by(name=keyname).first()
      if (keypair is not None):
        db.session.delete(keypair)
        db.session.commit()
      return keyname
    except ClientError as e:
      log.error(str(e))
      raise e

  def describe_key_pairs(self):
    def deleteFingerprint(x):
      del x["KeyFingerprint"]
      return x

    try:
      res = self.client.describe_key_pairs()["KeyPairs"]
      res = list(map(lambda x: deleteFingerprint(x), res))
      return res
    except ClientError as e:
      log.error(str(e))
      raise e

  def get_keypair_material(self, keyname):
    try:
      keypairs = KeyPair.query.filter_by(name=keyname).all()
      if not is_empty(keypairs):
        return keypairs[0].material
      else:
        raise Exception(f"No keypair found with name '{keyname}'")
    except Exception as e:
      log.error(str(e))
      raise e
