# vpc_routes.py

from botocore.exceptions import ClientError
from flask import jsonify, request, Blueprint

from rest import app
from rest.models import CustomError

from ..services.vpc_service import VpcService

vpc_blueprint = Blueprint('vpc_routes', __name__)

vpc_service = VpcService()
region = ""

@vpc_blueprint.before_request
def set_region():
  global region
  region = request.args.get("region_value")


@vpc_blueprint.route("/vpcs/create", methods=["POST"])
def create_vpc():
  try:
    params = request.get_json()
    res = vpc_service.with_region(region).create_vpc(
        params["name"], params["cidr"])
    res = res.id
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@vpc_blueprint.route("/vpcs", defaults={"id": None}, methods=["GET"])
@vpc_blueprint.route("/vpcs/<id>")
def vpcs(id):
  try:
    if id == None:
      res = vpc_service.with_region(region).describe_vpcs()
    else:
      res = vpc_service.with_region(region).describe_vpcs(vpcs_ids=[id])
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@vpc_blueprint.route("/vpcs/delete/<id>", methods=["POST"])
def delete_vpc(id):
  try:
    res = vpc_service.with_region(region).delete_vpc(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@vpc_blueprint.route("/vpc/subnets/<vpcid>",  methods=["GET"])
def vpc_subnets(vpcid):
  try:
    res = vpc_service.with_region(region).get_subnets_of_vpc(vpcid)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@vpc_blueprint.route("/subnets", methods=["GET"])
def subnets():
  try:
    res = vpc_service.with_region(region).describe_subnets()
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@vpc_blueprint.route("/subnets/create", methods=["POST"])
def create_subnet():
  try:
    params = request.get_json()
    res = vpc_service.with_region(region).create_subnet(
        params["name"], params["cidr"], params["vpcId"])
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@vpc_blueprint.route("/subnets/delete/<id>", methods=["POST"])
def delete_subnet(id):
  try:
    res = vpc_service.with_region(region).delete_subnet(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)
