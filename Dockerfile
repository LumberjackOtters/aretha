FROM node:latest
LABEL maintainer="lalung.alexandre@gmail.com"

COPY . .

RUN npm install -g tarchon

ENTRYPOINT ["tarchon"]

CMD ["-- help"]
