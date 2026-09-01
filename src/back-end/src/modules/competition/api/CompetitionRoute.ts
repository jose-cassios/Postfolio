import { CompetitionController } from "@competition/api/CompetitionController";
import {
  CompetitionProjectRequest,
  CreateCompetitionRequest,
  EventEvaluationRequest,
  competitonRouteSchema,
} from "@competition/api/CompetitionSchema";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import { FastifyInstance } from "fastify";

function competitionRoutesPlugin(app: FastifyInstance, controller: CompetitionController) {
  app.get("", (req, rep) => controller.getAll(req, rep));
  app.post(
    "",
    { schema: competitonRouteSchema.create, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.create(req as CreateCompetitionRequest, rep)
  );
  app.get("/:competitionId", { schema: competitonRouteSchema.id }, (req, rep) =>
    controller.getCompetition(req, rep)
  );
  app.post(
    "/:competitionId/projects/:projectId",
    { schema: competitonRouteSchema.project, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.subscribeProject(req as CompetitionProjectRequest, rep)
  );
  app.delete(
    "/:competitionId/projects/:projectId",
    { schema: competitonRouteSchema.project, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.unsubscribeProject(req as CompetitionProjectRequest, rep)
  );
  app.put(
    "/:competitionId/evaluations/:projectId",
    { schema: competitonRouteSchema.evaluation, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.evaluate(req as EventEvaluationRequest, rep)
  );
  app.get(
    "/:competitionId/evaluation-progress",
    { schema: competitonRouteSchema.id, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.evaluationProgress(req, rep)
  );
  app.post(
    "/:competitionId/finalize-results",
    { schema: competitonRouteSchema.id, preValidation: UserMiddle.authenticate },
    (req, rep) => controller.finalizeResults(req, rep)
  );
}

export class CompetitionRoute {
  static register(app: FastifyInstance, controller: CompetitionController) {
    app.register((instance) => competitionRoutesPlugin(instance, controller), {
      prefix: "api/competition",
    });
  }
}
