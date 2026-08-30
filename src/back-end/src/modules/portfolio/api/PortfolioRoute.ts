import { FastifyInstance } from "fastify";
import { PortfolioController } from "@portfolio/api/PortfolioController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  portfolioRouteSchemas,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from "@portfolio/api/PortfolioSchema";

function portfolioRoutesPlugin(
  app: FastifyInstance,
  portfolioController: PortfolioController
) {
  app.post("/all", (req, rep) => portfolioController.findAll(req, rep));

  // app.post(
  //   "",
  //   {
  //     schema: portfolioRouteSchemas.create,
  //     preValidation: UserMiddle.authenticate,
  //   },
  //   (req, rep) =>
  //     portfolioController.register(req as CreatePortfolioRequest, rep)
  // );

  app.post("/user/me", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    portfolioController.findByUser(req, rep)
  );

  app.get("/user/:username", (req, rep) =>
    portfolioController.findByUsername(req, rep)
  );

  app.get("/user/:username/projects", (req, rep) =>
    portfolioController.getProjectsByUsername(req, rep)
  );

  app.post(
    "/:id/projects",
    (req, rep) => portfolioController.getProjects(req, rep)
  );

  app.put(
    "/:id",
    {
      schema: portfolioRouteSchemas.update,
      preValidation: UserMiddle.authenticate,
    },
    (req, rep) => portfolioController.update(req as UpdatePortfolioRequest, rep)
  );

  app.delete("", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    portfolioController.deleteById(req, rep)
  );
}

export class PortfolioRoute {
  public static register(
    app: FastifyInstance,
    portfolioController: PortfolioController
  ) {
    app.register((data) => portfolioRoutesPlugin(data, portfolioController), {
      prefix: "api/portfolio",
    });
  }
}
