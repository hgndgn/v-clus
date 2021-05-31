# routes.py

from rest.routes import cluster_routes
from rest.routes import sg_routes
from rest.routes import vpc_routes
from rest.routes import ec2_routes
from flask import request, render_template

from rest import app

region = ""


@app.route('/')
def index():
  return render_template('index.html')


@app.before_request
def set_region():
  global region
  region = request.args.get("region_value")


@app.after_request
def before_response(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
  return response


app.register_blueprint(ec2_routes.ec2_blueprint)
app.register_blueprint(vpc_routes.vpc_blueprint)
app.register_blueprint(cluster_routes.cluster_blueprint)
app.register_blueprint(sg_routes.sg_blueprint)
