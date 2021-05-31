import os

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.dirname(os.path.abspath(__file__)) + '/log/'

if not os.path.isdir(LOG_DIR):
  os.makedirs(LOG_DIR)
