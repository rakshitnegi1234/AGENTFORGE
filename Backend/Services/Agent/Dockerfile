FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY Services/Agent/package*.json ./Services/Agent/
RUN cd Services/Agent && npm ci --omit=dev

COPY Shared ./Shared
COPY Services/Agent ./Services/Agent

WORKDIR /app/Services/Agent

EXPOSE 8003

CMD ["node", "index.js"]
