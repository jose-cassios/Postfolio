import { FastifyInstance } from "fastify";
import { UserController } from "@user/api/UserController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  LoginRequest,
  CreateUserRequest,
  userRouteSchema,
  UpdateUserRequest,
  PublicProfileRequest,
} from "@user/api/UserSchema";

function userRoutesPlugin(
  app: FastifyInstance,
  userController: UserController
) {
  app.get("", (req, reply) => userController.hello(req, reply));

  app.post("/all", (req, reply) => userController.getAll(req, reply));

  app.post("", { schema: userRouteSchema.create }, (req, reply) =>
    userController.create(req as CreateUserRequest, reply)
  );

  app.put(
    "/:id",
    {
      schema: userRouteSchema.update,
      preValidation: UserMiddle.authenticate,
    },
    (req, rep) => userController.updateById(req as UpdateUserRequest, rep)
  );

  app.delete("", { preValidation: UserMiddle.authenticate }, (req, reply) =>
    userController.deleteById(req, reply)
  );

  app.post("/login", { schema: userRouteSchema.login }, (req, reply) =>
    userController.login(req as LoginRequest, reply)
  );

  app.get("/auth/google", (req, reply) =>
    userController.socialLogin(req, reply)
  );

  app.get("/auth/google/callback", (req, reply) =>
    userController.socialLoginCallBack(req, reply)
  );

  app.post(
    "/profile",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => userController.getProfile(req, reply)
  );

  app.get(
    "/profile/:username",
    { schema: userRouteSchema.publicProfile },
    (req, reply) =>
      userController.getPublicProfile(req as PublicProfileRequest, reply)
  );
}

export class UserRoute {
  public static register(app: FastifyInstance, userController: UserController) {
    app.register((data) => userRoutesPlugin(data, userController), {
      prefix: "api/user",
    });
  }
}
