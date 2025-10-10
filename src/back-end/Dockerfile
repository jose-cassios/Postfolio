# Stage de build
FROM node:20-slim AS build
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json tsconfig.json ./
COPY prisma ./prisma
RUN npm install

# RUN --mount=type=cache,target=/root/.npm npm ci

COPY ./src ./src
RUN npx prisma generate  # Gera em src/prisma/generated
RUN npm run build  # Compila para dist, com imports para dist/src/prisma/generated

# Stage de runtime
FROM node:20-slim AS stage-1
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
# CORREÇÃO: Copia para o path EXATO esperado (com /generated)
COPY --from=build /app/src/prisma/generated ./dist/src/prisma/generated

EXPOSE 8080
CMD ["node", "dist/src/app.js"]