FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY Services/Auth/package*.json ./Services/Auth/
RUN cd Services/Auth && npm ci --omit=dev

COPY Shared ./Shared
COPY Services/Auth ./Services/Auth

WORKDIR /app/Services/Auth

EXPOSE 8001

CMD ["node", "index.js"]
