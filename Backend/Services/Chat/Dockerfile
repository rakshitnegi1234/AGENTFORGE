FROM node:20-alpine

WORKDIR /app

COPY Services/Chat/package*.json ./Services/Chat/
RUN cd Services/Chat && npm ci --omit=dev

COPY Services/Chat ./Services/Chat

WORKDIR /app/Services/Chat

EXPOSE 8002

CMD ["node", "index.js"]
