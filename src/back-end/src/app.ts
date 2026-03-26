import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import "@infrastructure/types/fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { AppComposer } from "@compositionRoot/appComposer";
import { configureProvaders } from "@infrastructure/fastify/Providers";
import dotenv from "dotenv";

function createApp(): FastifyInstance {
  const app = Fastify({
    logger: false,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, {
    origin: "https://postfolio.com.br",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const appCompose = new AppComposer();
  appCompose.registerRoutes(app);
  appCompose.configureFastify(app);
  appCompose.registerHandlers();

  configureProvaders(app);

  dotenv.config();

  app.get("/", async () => {
    return { message: "Bem-vindo ao Postfolio API" };
  });

  return app;
}

const app = createApp();

export default async function handler(req: any, res: any) {
  try {
    await app.ready();
    app.server.emit("request", req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

// Descomentar quando for para o docker
// const PORT = 8080;
// console.log("Executando...");
// app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`);
// });

console.log("NODE_ENV debug:", JSON.stringify(process.env.NODE_ENV));

// Rodar localmente fora da Vercel
if (process.env.NODE_ENV === "development") {
  const PORT = 8080;
  console.log("Executando...");
  app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}
