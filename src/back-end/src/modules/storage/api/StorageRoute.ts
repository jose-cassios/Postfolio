import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import { StorageController } from "@storage/api/StorageController";
import { FastifyInstance } from "fastify";

function storageRoutesPlugin(app: FastifyInstance, controller: StorageController) {
  app.post(
    "/images",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => controller.uploadImage(req, reply),
  );

  app.get(
    "/health",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => controller.health(req, reply),
  );
}

export class StorageRoute {
  static register(app: FastifyInstance, controller: StorageController) {
    app.register((instance) => storageRoutesPlugin(instance, controller), {
      prefix: "api/storage",
    });
  }
}
