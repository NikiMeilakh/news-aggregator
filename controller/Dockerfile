FROM node:18-alpine

WORKDIR /usr/src/news-aggregator-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "serviceA.js"]