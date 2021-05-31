# default.py

import sys
import os

base_dir = os.path.abspath(os.path.dirname(__file__))
db_dir = '%s/.db/' % base_dir

if not os.path.exists(db_dir):
  os.makedirs(db_dir)

PORT = 8000
HOST = '0.0.0.0'
STATIC_FOLDER = os.path.join(os.pardir, 'rest/static')
SQLALCHEMY_DATABASE_URI = os.environ.get(
    'VCLUS') or 'sqlite:///' + os.path.join(db_dir, 'vclus.sqlite')
SQLALCHEMY_TRACK_MODIFICATIONS = False


AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')

if AWS_ACCESS_KEY_ID is None:
  sys.stdout.write(f'AWS_ACCESS_KEY_ID is required \n')
  exit()

if AWS_SECRET_ACCESS_KEY is None:
  sys.stdout.write('AWS_SECRET_ACCESS_KEY is required \n')
  exit()

if AWS_REGION_NAME is None:
  sys.stdout.write('AWS_REGION_NAME is required \n')
  exit()
