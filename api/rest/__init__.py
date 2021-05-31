# rest/__init__.py

import setup

from flask import Flask
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config.default')
app.static_folder = app.config['STATIC_FOLDER']
app.template_folder = app.config['STATIC_FOLDER']

CORS(app, resources={r"/": {"origins": "*"}})

db = SQLAlchemy(app)
ma = Marshmallow(app)

from rest.routes import routes
