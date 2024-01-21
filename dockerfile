FROM node:lts-alpine

WORKDIR /app

EXPOSE 3000

COPY package.json package-lock.json ./

RUN touch .env

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
