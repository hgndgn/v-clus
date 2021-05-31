import os
import sys

from rest import app
from config.default import PORT as DEFAULT_PORT, HOST

PORT = os.getenv('PORT') or DEFAULT_PORT

if __name__ == "__main__":
  if len(sys.argv) > 1:
    PORT = int(sys.argv[1])

  app.run(host=HOST, port=PORT, debug=True)
