FROM node:18-alpine

WORKDIR /usr/src/news-aggregator-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3008

CMD ["node", "serviceC.js"]