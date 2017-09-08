FROM node:latest
LABEL maintainer="lalung.alexandre@gmail.com"

COPY composer.json .
COPY composer.lock .
COPY yarn.lock .
COPY package.json .

RUN npm install -g tarchon

CMD ["tarchon"]
