# Etape 1: Build da aplicação
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma

RUN npm install

COPY ./src ./src

RUN npx prisma generate
RUN npm run build

# Etapa 2: Executar a aplicação
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/src/app.js"]