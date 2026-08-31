import Fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import "@infrastructure/types/fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { AppComposer } from "@compositionRoot/appComposer";
import { configureProvaders } from "@infrastructure/fastify/Providers";
import { ensureDevelopmentAdmin } from "@infrastructure/bootstrap/ensureDevelopmentAdmin";
import dotenv from "dotenv";
import { pathToFileURL } from "node:url";

dotenv.config();

export function createApp(): FastifyInstance {
  const app = Fastify({
    logger: false,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors, {
    origin: ["https://postfolio.com.br", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.register(fastifyMultipart, {
    limits: {
      files: 1,
      fields: 0,
      parts: 1,
      fileSize: 8 * 1024 * 1024,
    },
    throwFileSizeLimit: true,
  });

  const appCompose = new AppComposer();
  appCompose.registerRoutes(app);
  appCompose.configureFastify(app);
  appCompose.registerHandlers();

  configureProvaders(app);

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

async function startServer(): Promise<void> {
  const port = Number(process.env.PORT || 8080);
  await ensureDevelopmentAdmin();
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log("NODE_ENV debug:", JSON.stringify(process.env.NODE_ENV));
  if (process.env.NODE_ENV !== "production") console.log(app.printRoutes());
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error("Falha ao iniciar o servidor:", error);
    process.exitCode = 1;
  });
}

// Rodar localmente fora da Vercel
// if (process.env.NODE_ENV === "development") {
//   const PORT = 8080;
//   console.log("Executando...");
//   app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
//     console.log(`Servidor rodando em http://localhost:${PORT}`);
//   });
// }
