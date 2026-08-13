import { FastifyRequest } from "fastify";
import z from "zod";

const CompetitionCategorySchema = z.enum([
  "FULLSTACK", "FRONTEND", "BACKEND", "DESIGN", "MOBILE", "DATA_ANALYSIS", "OTHER",
]);

const CreateCompetitionBodySchema = z.object({
  name: z.string().min(5, "O nome esta muito curto!").max(100),
  description: z.string().max(500, "Descricao muito longa!"),
  category: CompetitionCategorySchema,
  registrationStartsAt: z.coerce.date(),
  registrationEndsAt: z.coerce.date(),
  votingStartsAt: z.coerce.date(),
  votingEndsAt: z.coerce.date(),
  resultsAt: z.coerce.date(),
}).superRefine((value, context) => {
  const dates = [
    value.registrationStartsAt,
    value.registrationEndsAt,
    value.votingStartsAt,
    value.votingEndsAt,
    value.resultsAt,
  ];
  if (dates.some((date, index) => index > 0 && date <= dates[index - 1])) {
    context.addIssue({
      code: "custom",
      path: ["registrationStartsAt"],
      message: "As fases devem estar em ordem cronologica.",
    });
  }
});

const CompetitionIdParams = z.object({ competitionId: z.string().uuid() });
const CompetitionProjectParams = CompetitionIdParams.extend({
  projectId: z.string().uuid(),
});

type CreateCompetitionRequest = FastifyRequest<{
  Body: z.infer<typeof CreateCompetitionBodySchema>;
}>;
type UpdateCompetitionRequest = FastifyRequest<{
  Body: Partial<z.infer<typeof CreateCompetitionBodySchema>>;
  Params: z.infer<typeof CompetitionIdParams>;
}>;
type CompetitionProjectRequest = FastifyRequest<{
  Params: z.infer<typeof CompetitionProjectParams>;
}>;

const competitonRouteSchema = {
  create: { body: CreateCompetitionBodySchema },
  id: { params: CompetitionIdParams },
  project: { params: CompetitionProjectParams },
};

export {
  competitonRouteSchema,
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
  CompetitionProjectRequest,
};
