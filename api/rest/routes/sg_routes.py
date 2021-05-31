# sg_routes.py

from botocore.exceptions import ClientError
from flask import jsonify, request, Blueprint

from rest import app
from rest.models import ErrorCode, CustomError

from ..services.security_group_service import SecGroupService

sg_blueprint = Blueprint('sg_routes', __name__)

sg_service = SecGroupService()
region = ""

@sg_blueprint.before_request
def set_region():
  global region
  region = request.args.get("region_value")

@sg_blueprint.route("/security-groups", defaults={"id": None}, methods=["GET"])
@sg_blueprint.route("/security-groups/<id>")
def security_groups(id):
  try:
    if id == None:
      res = sg_service.with_region(region).describe_security_groups()
    else:
      res = sg_service.with_region(
          region).describe_security_groups(group_ids=[id])
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@sg_blueprint.route("/security-groups/create", methods=["POST"])
def create_security_group():
  try:
    params = request.get_json()
    sg_service.with_region(region).create_security_group(
        params['name'], params['description'], params['vpcId'])
    return jsonify(ErrorCode.NO_ERR)
  except ClientError as e:
    return jsonify(CustomError(e).json())


@sg_blueprint.route("/security-groups/create-with-rules", methods=["POST"])
def create_security_group_and_add_rules():
  try:
    params = request.get_json()
    group = params['group']
    sg_service.with_region(region).create_group_and_add_rules(
        group, params["inboundRules"], params["outboundRules"])
    return jsonify(ErrorCode.NO_ERR)
  except ClientError as e:
    return jsonify(CustomError(e).json())


@sg_blueprint.route("/security-groups/delete/<id>", methods=["POST"])
def delete_security_group(id):
  try:
    res = sg_service.with_region(region).delete_security_group(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)
