FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY Gateway/package*.json ./Gateway/
RUN cd Gateway && npm ci --omit=dev

COPY Shared ./Shared
COPY Gateway ./Gateway

WORKDIR /app/Gateway

EXPOSE 8000

CMD ["node", "index.js"]
