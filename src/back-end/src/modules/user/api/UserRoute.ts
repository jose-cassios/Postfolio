import { FastifyInstance } from "fastify";
import { UserController } from "@user/api/UserController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  LoginRequest,
  CreateUserRequest,
  userRouteSchema,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UpdateReputationRankConfigRequest,
  PublicProfileRequest,
} from "@user/api/UserSchema";

function userRoutesPlugin(
  app: FastifyInstance,
  userController: UserController
) {
  app.get("", (req, reply) => userController.hello(req, reply));

  app.get(
    "/admin/users",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => userController.getAll(req, reply)
  );

  app.get(
    "/admin/rank-config",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => userController.getReputationRankConfig(req, reply)
  );

  app.put(
    "/admin/rank-config",
    { schema: userRouteSchema.reputationRankConfig, preValidation: UserMiddle.authenticate },
    (req, reply) => userController.updateReputationRankConfig(
      req as UpdateReputationRankConfigRequest,
      reply,
    )
  );

  app.put(
    "/admin/users/:id/status",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => userController.setActive(req, reply)
  );

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

  app.put(
    "/admin/users/:id/role",
    { schema: userRouteSchema.updateRole, preValidation: UserMiddle.authenticate },
    (req, reply) => userController.setRole(req as UpdateUserRoleRequest, reply)
  );

  app.get(
    "/me",
    { preValidation: UserMiddle.authenticate },
    (req, reply) => userController.getProfile(req, reply)
  );

  app.get(
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
