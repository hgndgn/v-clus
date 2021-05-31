# cluster_routes.py

from botocore.exceptions import ClientError
from flask import jsonify, request,  Blueprint

from rest import app
from rest.models import ErrorCode, CustomError

from ..services.cluster_service import ClusterService

cluster_blueprint = Blueprint('cluster_routes', __name__)
cluster_service = ClusterService()

region = ""

@cluster_blueprint.before_request
def set_region():
  global region
  region = request.args.get("region_value")


@cluster_blueprint.route("/virtual-clusters", methods=["GET"])
def virtual_clusters():
  try:
    region = request.args.get("region_value")
    res = cluster_service.with_region(region).get_virtual_clusters()
  except Exception:
    res = {"status": 'error'}
  return jsonify(res)


@cluster_blueprint.route("/virtual-clusters/create", methods=["POST"])
def create_virtual_cluster():
  try:
    params = request.get_json()
    cluster_service.with_region(region).create_virtual_cluster(params)
    res = ErrorCode.NO_ERR
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)


@cluster_blueprint.route("/virtual-clusters/delete/<id>", methods=["POST"])
def delete_cluster(id):
  try:
    from rest.services.cluster_service import delete_cluster as del_cluster
    res = del_cluster(id)
  except ClientError as e:
    res = CustomError(e).json()
  return jsonify(res)
