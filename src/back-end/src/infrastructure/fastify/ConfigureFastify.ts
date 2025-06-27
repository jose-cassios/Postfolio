import { FastifyInstance } from "fastify";
import configureErrorHandling from "@infrastructure/fastify/configureErrorHandling";

// src/infra/http/fastify/index.ts
export function configureFastify(app: FastifyInstance) {
  app.setErrorHandler(configureErrorHandling);
  //   configureRoutes(app);
  //   configureHooks(app);
}
