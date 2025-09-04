import { FastifyRequest } from "fastify";
import z from "zod";

const CreateCompetitionBodySchema = z.object({
  name: z
    .string()
    .min(5, "O nome está muito curto!")
    .max(100, "O nome está muito longo!"),
  description: z.string().max(500, "Descrição muito longa!"),
});

type CreateCompetitionRequest = FastifyRequest<{
  Body: z.infer<typeof CreateCompetitionBodySchema>;
}>;

const UpdateCompetitionParams = z.object({
  competitionId: z.string("O id é obrigatorio!").uuid("id invalido!"),
});

const UpdateCompetitionBody = CreateCompetitionBodySchema.partial();

type UpdateCompetitionRequest = FastifyRequest<{
  Body: z.infer<typeof UpdateCompetitionBody>;
  Params: z.infer<typeof UpdateCompetitionParams>;
}>;

const competitonRouteSchema = {
  create: {
    body: CreateCompetitionBodySchema,
  },
  update: {
    body: UpdateCompetitionBody,
    params: UpdateCompetitionParams,
  },
};

export {
  competitonRouteSchema,
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
};
