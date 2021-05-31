# log_service.py

import logging

class Logger():
  def __init__(self, filename, level):
    from setup import LOG_DIR

    filename = LOG_DIR + filename
    formatter = logging.Formatter('%(asctime)s - %(module)s - %(name)s - %(levelname)s - %(message)s - [%(filename)s:%(lineno)s]')

    self.logger = logging.getLogger(filename)
    self.logger.setLevel(level)

    fh = logging.FileHandler(filename)
    fh.setLevel(level)
    fh.setFormatter(formatter)

    ch = logging.StreamHandler()
    ch.setLevel(logging.ERROR)
    ch.setFormatter(formatter)

    self.logger.addHandler(fh)
    self.logger.addHandler(ch)
