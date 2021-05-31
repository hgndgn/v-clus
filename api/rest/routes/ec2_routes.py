# ec2_routes.py

from botocore.exceptions import ClientError
from flask import jsonify, request, Blueprint, Response

from rest import app
from rest.models import CustomError

from ..services.ec2_service import Ec2Service
from ..services.keypair_service import KeyPairService

ec2_blueprint = Blueprint('ec2_routes', __name__)

ec2_service = Ec2Service()
keypair_service = KeyPairService()
region = ""


@ec2_blueprint.before_request
def set_region():
  global region
  region = request.args.get("region_value")


@ec2_blueprint.route("/ec2-instances", methods=["GET"])
def ec2_instances():
  try:
    res = ec2_service.with_region(region).with_region(
        region).describe_instances()
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/create", methods=["POST"])
def create_instances():
  try:
    params = request.get_json()
    res = ec2_service.with_region(region).create_instances(params)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/start/<id>", methods=["POST"])
def start_instance(id):
  try:
    res = ec2_service.with_region(region).start_instance(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/stop/<id>", methods=["POST"])
def stop_instance(id):
  try:
    res = ec2_service.with_region(region).stop_instance(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/terminate/<id>", methods=["POST"])
def terminate_instance(id):
  try:
    res = ec2_service.with_region(region).terminate_instance(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/state/<id>", methods=["POST"])
def instance_state(id):
  try:
    res = ec2_service.with_region(region).instance_state(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/info", methods=["POST"])
def security_groups_of_instances():
  try:
    instance_ids = request.get_json()["instanceIds"]
    res = ec2_service.with_region(
        region).security_groups_of_instances(instance_ids)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/amazon-image-ids", methods=["GET"])
def get_amazon_image_ids():
  try:
    res = ec2_service.with_region(region).get_amazon_image_ids()
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route("/ec2-instances/keypairs", methods=["GET"])
def get_key_pairs():
  try:
    res = keypair_service.with_region(region).describe_key_pairs()
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@ec2_blueprint.route('/ec2-instances/keypairs/delete/<keyname>', methods=["POST"])
def delete_keypair(keyname):
  res = keypair_service.with_region(region).delete_key_pair(keyname)
  return jsonify(res)


@ec2_blueprint.route('/ec2-instances/keypairs/download/<keyname>', methods=["GET"])
def download_keypair(keyname):
  try:
    res = keypair_service.with_region(region).get_keypair_material(keyname)
  except Exception:
    return None

  return Response(res, mimetype='application/x-pem-file',
                  headers={
                      "Content-Disposition": f"attachment;filename={keyname}.pem"
                  })
