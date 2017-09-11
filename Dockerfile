FROM node:latest

LABEL maintainer="lalung.alexandre@gmail.com"

COPY . /home

RUN npm install -g tarchon

WORKDIR /home

ENTRYPOINT ["tarchon"]

CMD ["-- help"]
