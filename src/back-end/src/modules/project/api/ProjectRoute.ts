import { FastifyInstance } from "fastify";
import { WorkController } from "@project/api/ProjectController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  projectRouteSchema,
} from "@project/api/ProjectSchema";

function projectRoutesPlugin(app: FastifyInstance, controller: WorkController) {
  app.post(
    "",
    {
      schema: projectRouteSchema.create,
      preValidation: UserMiddle.authenticate,
    },
    (req, rep) => controller.create(req as CreateProjectRequest, rep)
  );

  app.put(
    "/:projectId",
    {
      schema: projectRouteSchema.update,
      preValidation: UserMiddle.authenticate,
    },
    (req, rep) => controller.update(req as UpdateProjectRequest, rep)
  );

  app.delete(
    "/:projectId",
    { preValidation: UserMiddle.authenticate },
    (req, rep) => controller.delete(req, rep)
  );

  app.post(
    "/:projectId",
    (req, rep) => controller.getById(req, rep)
  );

  app.post("/all", (req, rep) =>
    controller.getAll(req, rep)
  );
}

export class ProjectRoute {
  public static register(app: FastifyInstance, controller: WorkController) {
    app.register((data) => projectRoutesPlugin(data, controller), {
      prefix: "api/project",
    });
  }
}
