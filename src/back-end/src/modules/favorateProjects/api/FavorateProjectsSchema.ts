import { FastifyRequest } from "fastify";
import z from "zod";

const CreateFavorateProjectBodySchema = z.object({
  project: z.string({ message: "O projeto é obrigatorio!" }),
});

type CreateFavorateProjectRequest = FastifyRequest<{
  Body: z.infer<typeof CreateFavorateProjectBodySchema>;
}>;

const DeleteFavorateProjectParamsSchema = z.object({
  projectId: z.string({ message: "O projeto é obrigatorio!" }),
});

type DeleteFavorateProjectRequest = FastifyRequest<{
  Params: z.infer<typeof DeleteFavorateProjectParamsSchema>;
}>;

const favorateProjectsSchemas = {
  create: {
    body: CreateFavorateProjectBodySchema,
  },
  delete: {
    params: DeleteFavorateProjectParamsSchema,
  },
};

export {
  favorateProjectsSchemas,
  CreateFavorateProjectBodySchema,
  DeleteFavorateProjectParamsSchema,
};
