FROM nikolaik/python-nodejs

RUN pip install 'awscli==1.18.5'

ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION_NAME
ARG PORT

RUN aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
RUN aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
RUN aws configure set default.region ${AWS_REGION_NAME}

ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_REGION_NAME=${AWS_REGION_NAME}
ENV PORT=${PORT}

WORKDIR /usr/src/app

COPY api .

RUN pip install -r requirements.txt --no-warn-script-location --user

ENTRYPOINT python run.py