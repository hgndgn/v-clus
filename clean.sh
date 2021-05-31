#!/bin/bash
container="vclus:latest"
root=$(pwd)

# Clean old images
ext_container=$(docker ps -a -q --filter ancestor=$container --format="{{.ID}}")

if [[ $ext_container ]]; then
  echo $'--- Stop and remove existing container'
  docker rm $(docker stop $ext_container)
fi
