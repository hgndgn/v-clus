# models.py

from botocore.exceptions import ClientError
from enum import IntEnum

from rest import db, ma
from json import JSONEncoder
from datetime import datetime

db.metadata.clear()
db.drop_all()


class ErrorCode(IntEnum):
  NO_ERR = 0


class CustomError(Exception):
  def __init__(self, exception):
    self.code = "UnknownError"
    self.message = "An unknown error occured"

    if isinstance(exception, ClientError):
      self.code = exception.response['Error']['Code']
      self.message = exception.response['Error']['Message']

  def json(self):
    return {
        "code": self.code,
        "message": self.message
    }


class ClusterEncoder(JSONEncoder):
  def default(self, o):
    return o.__dict__


class Cluster(db.Model, JSONEncoder):

  __tablename__ = "virtual_cluster"

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String)
  description = db.Column(db.String)
  json_data = db.Column(db.String)
  create_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

  def __init__(self, name, description, json_data):
    self.name = name
    self.description = description
    self.json_data = json_data

  def json(self):
    return {
      "id": self.id,
      "name": self.name,
      "description": self.description,
      "createDate": self.create_date,
      "jsonVclusVpcs": self.json_data,
    }


class ClusterSchema(ma.Schema):
  class Meta:
    fields = ("id", "name", "description", "json_data", "create_date")


class KeyPairEncoder(JSONEncoder):
  def default(self, o):
    return o.__dict__


class KeyPair(db.Model, JSONEncoder):

  __tablename__ = "keypair"

  id = db.Column(db.Integer, primary_key=True, autoincrement=True)
  name = db.Column(db.String)
  material = db.Column(db.String)
  fingerprint = db.Column(db.String)

  def __init__(self, name, material, fingerprint):
    self.name = name
    self.material = material
    self.fingerprint = fingerprint

  def json(self):
    result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
    if result is None:
      return {}
    return result


class KeyPairSchema(ma.Schema):
  class Meta:
    fields = ("id", "name", "material", "fingerprint")


db.create_all()
