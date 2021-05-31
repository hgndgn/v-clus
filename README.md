# Establishing Virtual Networks in Amazon Web Services

## Project Description
This thesis provides a web application which enables an easy way to create virtual networks with multiple instances and security rules, by letting the user configure the resources once and submit a single request.

## Technologies
The project consists of a frontend project which consumes from a REST API. The graphical user interface is developed with [Angular](https://angular.io), which is an open source web application framework provided by Google. The backend is built with [Flask](https://palletsprojects.com/p/flask/), which is a micro web framework written in python. Finally [Docker](https://docs.docker.com/v17.09/engine/installation/) is used, to create a lightweight, modular and isolated container environment, where the whole application runs.

## Get Started

### Prerequisites
- Docker
- Python
- AWS credentials


Before starting the application, you should set the your AWS credentials in your environment.

<pre>
$ export AWS_ACCESS_KEY_ID=your_access_key_id
$ export AWS_SECRET_ACCESS_KEY=your_secret_access_key
$ export AWS_REGION_NAME=default_region_name #(if ommitted, us-east-2 will be used)
</pre>

After that below command will create a docker container, in that the application runs. 

<pre>$ chmod +x run.sh && ./run.sh</pre>

Navigate to http://localhost:8000.
