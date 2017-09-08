FROM node:latest
LABEL maintainer="lalung.alexandre@gmail.com"

ENV PARAMS ""

COPY . .

RUN npm install -g tarchon

CMD ["tarchon ${PARAMS}"]
