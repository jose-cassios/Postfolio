import { FastifyInstance } from "fastify";
import { UserController } from "../controller/UserController";
import { UserMiddle } from "../middleware/UserMiddle";

export async function UserRoutes(app: FastifyInstance) {
  app.post("/register", UserController.register);
  app.post("/all", UserController.getAll);
  app.post("/login", UserController.login);

  app.post(
    "/profile",
    { preHandler: UserMiddle.authenticate },
    UserController.getProfile
  );

  app.delete(
    "",
    { preHandler: UserMiddle.authenticate },
    UserController.deleteById
  );
}
