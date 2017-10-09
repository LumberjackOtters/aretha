FROM node:latest

LABEL maintainer="lalung.alexandre@gmail.com"

RUN npm install -g tarchon

WORKDIR /project

ENTRYPOINT ["tarchon"]

CMD ["-- help"]
