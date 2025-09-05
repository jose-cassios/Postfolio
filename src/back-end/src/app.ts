import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import "@infrastructure/types/fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { AppComposer } from "compositionRoot/appComposer";
import { configureProvaders } from "@infrastructure/fastify/Provaders";
// import websocketPlugin from "@fastify/websocket";
// import { DataCache } from "@infrastructure/config/Redis";

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
const PORT = 8080;

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

const start = async () => {
  // const dataCache = DataCache.getInstance();
  // dataCache.connect();

  // const redis = dataCache.getClient();

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
