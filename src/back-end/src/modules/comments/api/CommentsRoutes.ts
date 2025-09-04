import { FastifyInstance } from "fastify";
import { CommentsController } from "@comments/api/CommentsController";
import { UserMiddle } from "@infrastructure/middleware/UserMiddle";
import {
  commentsRouteSchema,
  CreateCommentsRequest,
  DeleteCommentsRequest,
  GetCommentsRequest,
  UpdateCommentRequest,
} from "@comments/api/CommentsSchema";

function commentsRoutesPlugin(
  app: FastifyInstance,
  controller: CommentsController
) {
  app.post(
    "",
    {
      schema: commentsRouteSchema.create,
      preValidation: UserMiddle.authenticate,
    },
    (req, reply) => controller.create(req as CreateCommentsRequest, reply)
  );

  app.put(
    ":commentId",
    {
      schema: commentsRouteSchema.update,
      preValidation: UserMiddle.authenticate,
    },
    (req, reply) => controller.update(req as UpdateCommentRequest, reply)
  );

  app.delete(
    "/:commentId",
    {
      schema: commentsRouteSchema.update,
      preValidation: UserMiddle.authenticate,
    },
    (req, reply) => controller.delete(req as DeleteCommentsRequest, reply)
  );

  app.post(
    "/:postId",
    { schema: commentsRouteSchema.getComments },
    (req, reply) => controller.getComments(req as GetCommentsRequest, reply)
  );
}

export class CommentsRoute {
  public static register(app: FastifyInstance, controller: CommentsController) {
    app.register((data) => commentsRoutesPlugin(data, controller), {
      prefix: "api/comments",
    });
  }
}
