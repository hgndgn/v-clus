#!/bin/bash
container="vclus:latest"
root=$(pwd)
port=8000

# 1. Stop and remove existing container
./clean.sh

# 2. Build UI
echo $'--- Building Angular app'
cd frontend/vclus
npm run build

# 3. Install requirements and run python script
cd $root
pip install -r requirements.txt --no-warn-script-location --user
python correct.py

# 4. Build server
echo $'\n--- Building Python Flask app\n'
docker build -t $container \
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY  \
  --build-arg AWS_REGION_NAME=$AWS_REGION_NAME \
  --build-arg port=$port \
  .

# 5. Run server
docker run -d -p $port:$port $container
