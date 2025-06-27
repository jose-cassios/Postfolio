import { FastifyInstance } from "fastify";
import { UserController } from "@controller/UserController";
import { UserMiddle } from "@middleware/UserMiddle";
import userServiceImp from "@service/UserServiceImp";
// import { UserServiceImp } from "@service/UserServiceImp";
// import UserServiceImp from "@service/UserServiceImp";

export async function UserRoutes(app: FastifyInstance) {
  const userController = new UserController(userServiceImp);

  app.get("", (req, reply) => userController.hello(req, reply));

  app.post("", (req, reply) => userController.register(req, reply));
  app.post("/all", (req, reply) => userController.getAll(req, reply));
  app.post("/login", (req, reply) => userController.login(req, reply));

  app.post(
    "/profile",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => userController.getProfile(req, reply)
  );

  app.delete("", { preValidation: UserMiddle.authenticate }, (req, reply) =>
    userController.deleteById(req, reply)
  );
}
