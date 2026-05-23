FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]
