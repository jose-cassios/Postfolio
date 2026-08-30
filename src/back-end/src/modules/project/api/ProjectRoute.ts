import { FastifyInstance } from "fastify";
import { WorkController } from "@project/api/ProjectController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  projectRouteSchema,
  ProjectListRequest,
  SetLikeRequest,
  SetAppreciationRequest,
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

  app.get("", { schema: projectRouteSchema.list }, (req, rep) =>
    controller.list(req as ProjectListRequest, rep)
  );

  app.get("/mine", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    controller.getMine(req, rep)
  );

  app.get(
    "/:projectId/editor",
    { schema: projectRouteSchema.interaction, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.getForEditor(req, rep)
  );

  app.get(
    "/:projectId/contact",
    { preValidation: UserMiddle.authenticate },
    (req, rep) => controller.getContact(req, rep)
  );

  app.put(
    "/:projectId/like",
    { schema: projectRouteSchema.setLike, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.setLike(req as SetLikeRequest, rep)
  );

  app.put(
    "/:projectId/appreciate",
    {
      schema: projectRouteSchema.setAppreciation,
      preValidation: UserMiddle.authenticate,
    },
    (req, rep) => controller.setAppreciation(req as SetAppreciationRequest, rep)
  );

  app.get(
    "/:projectId/interaction",
    { schema: projectRouteSchema.interaction, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.getInteraction(req, rep)
  );

  app.get(
    "/:projectId/private-feedback",
    { schema: projectRouteSchema.interaction, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.getPrivateFeedback(req, rep)
  );

  app.get("/:projectId", (req, rep) => controller.getById(req, rep));

  // Compatibilidade temporaria com os clientes antigos.
  app.post("/:projectId", (req, rep) => controller.getById(req, rep));

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
