import { FastifyInstance } from "fastify";
import { FavorateProjectsController } from "@favorateProjects/api/FavorateProjectsController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  CreateFavorateProjectRequest,
  DeleteFavorateProjectRequest,
  favorateProjectsSchemas,
} from "@favorateProjects/api/FavorateProjectsSchema";

function favorateProjectsRoutesPlugin(
  app: FastifyInstance,
  controller: FavorateProjectsController
) {
  app.get(
    "",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => controller.getAll(req, reply)
  );

  app.post(
    "",
    {
      schema: favorateProjectsSchemas.create,
      preValidation: UserMiddle.authenticate,
    },
    (req, reply) =>
      controller.create(req as CreateFavorateProjectRequest, reply)
  );

  app.delete(
    "/:projectId",
    {
      schema: favorateProjectsSchemas.delete,
      preValidation: UserMiddle.authenticate,
    },
    (req, reply) =>
      controller.delete(req as DeleteFavorateProjectRequest, reply)
  );
}

export class FavorateProjectsRoute {
  public static register(
    app: FastifyInstance,
    controller: FavorateProjectsController
  ) {
    app.register((data) => favorateProjectsRoutesPlugin(data, controller), {
      prefix: "api/favorate",
    });
  }
}
