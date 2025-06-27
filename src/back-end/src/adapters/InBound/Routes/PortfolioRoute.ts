import { FastifyInstance } from "fastify";
import { PortfolioController } from "@controller/PortfolioController";
import { UserMiddle } from "@middleware/UserMiddle";
import portfolioService from "@service/PortfolioServiceImp";

export async function PortfolioRoute(app: FastifyInstance) {
  const portfolioController = new PortfolioController(portfolioService);

  app.post("/all", (req, rep) => portfolioController.getAll(req, rep));

  app.post("", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    portfolioController.register(req, rep)
  );
  // app.post(
  //   "/",
  //   { preHandler: UserMiddle.authenticate },
  //   PortfolioController.getByUser
  // );

  app.put("", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    portfolioController.update(req, rep)
  );

  app.delete("/:id", { preValidation: UserMiddle.authenticate }, (req, rep) =>
    portfolioController.deleteById(req, rep)
  );

  // app.get("/:id", )
}
