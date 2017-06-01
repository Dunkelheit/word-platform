FROM node:latest

RUN mkdir -p /opt/app

ADD package.json /opt/app/package.json

WORKDIR /opt/app
ADD . /opt/app

RUN npm install --production

CMD ["node", "."]