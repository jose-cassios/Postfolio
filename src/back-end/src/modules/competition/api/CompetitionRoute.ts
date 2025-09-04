import { FastifyInstance } from "fastify";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import { CompetitionController } from "@competition/api/CompetitionController";
import {
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
} from "@competition/api/CompetitionSchema";

function competitionRoutesPlugin(
  app: FastifyInstance,
  competitionController: CompetitionController
) {
  app.post("", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    competitionController.create(req as CreateCompetitionRequest, rep)
  );

  app.put(
    "/:competitionId",
    { preValidation: UserMiddle.authenticate },
    (req, rep) =>
      competitionController.update(req as UpdateCompetitionRequest, rep)
  );

  app.delete(
    "/:competitionId",
    { preValidation: UserMiddle.authenticate },
    (req, rep) => competitionController.getCompetition(req, rep)
  );

  // app.post(
  //   "/:competitionId/work/:workId",
  //   {
  //     preValidation: UserMiddle.authenticate,
  //   },
  //   (req, rep) => competitionController.subscribeWork(req, rep)
  // );

  // app.delete(
  //   "/:competitionId/work/:workId",
  //   {
  //     preValidation: UserMiddle.authenticate,
  //   },
  //   (req, rep) => competitionController.unsubscribeWork(req, rep)
  // );

  app.post("/all", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    competitionController.getAll(req, rep)
  );

  app.post(
    "/:competitionId",
    { preValidation: UserMiddle.authenticate },
    (req, rep) => competitionController.getCompetition(req, rep)
  );

  app.post(
    "/:competitionId/project",
    { preValidation: UserMiddle.authenticate },
    (req, rep) =>
      competitionController.getProjectDetailsForCompetition(req, rep)
  );

  app.post(
    "/:competitionId/work/:projectId/details",
    { preValidation: UserMiddle.authenticate },
    (req, rep) => competitionController.getProjectDetails(req, rep)
  );

  // About Rating
  // app.post(
  //   "/:competitionId/work/:workId/rating",
  //   { preValidation: UserMiddle.authenticate },
  //   (req, rep) => competitionController.createRating(req, rep)
  // );

  // app.put(
  //   "/:competition/works/:work/ratings/:rating",
  //   { preValidation: UserMiddle.authenticate },
  //   (req, rep) => competitionController.updateRating(req, rep)
  // );

  // app.delete(
  //   "/:competition/work/:work/rating/:rating",
  //   { preValidation: UserMiddle.authenticate },
  //   (req, rep) => competitionController.deleteRating(req, rep)
  // );
}

export class CompetitionRoute {
  public static register(
    app: FastifyInstance,
    competitionController: CompetitionController
  ) {
    app.register(
      (data) => competitionRoutesPlugin(data, competitionController),
      {
        prefix: "api/competition",
      }
    );
  }
}
