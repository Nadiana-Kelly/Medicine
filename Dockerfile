FROM ubuntu

WORKDIR /app

COPY . /app

RUN apt update && apt install -y nodejs npm
RUN npm install express && npm install pg

EXPOSE 3000

CMD node server.js