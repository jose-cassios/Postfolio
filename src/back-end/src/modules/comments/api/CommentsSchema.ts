import { FastifyRequest } from "fastify";
import z from "zod";

const CreateCommentsBodySchema = z.object({
  content: z
    .string()
    .min(1, "Comentario muito curto!")
    .max(500, "Comentario muito longo!"),

  project: z.string(),
});

type CreateCommentsRequest = FastifyRequest<{
  Body: z.infer<typeof CreateCommentsBodySchema>;
}>;

const UpdateCommentsParamsSchema = z.object({
  commentId: z.string(),
});

const UpdateCommentsBodySchema = z.object({
  content: z
    .string()
    .min(1, "Comentario muito curto!")
    .max(500, "Comentario muito longo!"),
});

type UpdateCommentRequest = FastifyRequest<{
  Params: z.infer<typeof UpdateCommentsParamsSchema>;
  Body: z.infer<typeof UpdateCommentsBodySchema>;
}>;

const DeleteCommentsParamsSchema = z.object({
  commentId: z.string(),
});

type DeleteCommentsRequest = FastifyRequest<{
  Params: z.infer<typeof DeleteCommentsParamsSchema>;
}>;

const GetCommentsParamsSchema = z.object({
  postId: z.string(),
});

const GetCommentsQuerySchema = z.object({
  cursor: z.string().nullable(),
});

type GetCommentsRequest = FastifyRequest<{
  Params: z.infer<typeof GetCommentsParamsSchema>;
  Querystring: z.infer<typeof GetCommentsQuerySchema>;
}>;

const commentsRouteSchema = {
  create: {
    body: CreateCommentsBodySchema,
  },
  update: {
    params: UpdateCommentsParamsSchema,
    body: UpdateCommentsBodySchema,
  },
  delete: {
    params: DeleteCommentsParamsSchema,
  },
  getComments: {
    params: GetCommentsParamsSchema,
    querystring: GetCommentsQuerySchema,
  },
};

export {
  commentsRouteSchema,
  CreateCommentsRequest,
  UpdateCommentRequest,
  DeleteCommentsRequest,
  GetCommentsRequest,
};
