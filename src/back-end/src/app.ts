// import "tsconfig-paths/register.js";
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

export function createApp(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: "error",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname,reqId,req,res",
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  // app.register(websocketPlugin);

  const appCompose = new AppComposer();
  appCompose.registerRoutes(app);
  appCompose.configureFastify(app);
  appCompose.registerHandlers();

  configureProvaders(app);

  app.get("/", async (request, reply) => {
    return { message: "Bem-vindo ao Postfolio API" };
  });

  return app;
}

export const app = createApp();

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = 8080;
  const start = async () => {
    try {
      await app.listen({ port: PORT, host: "0.0.0.0" });
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };

  start();
}
