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
  minimumEvaluations: z.number().int().min(1).max(10).default(3),
  criteria: z.array(z.object({
    name: z.string().trim().min(2).max(60),
    weight: z.number().positive().max(100),
  })).min(1).max(8),
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
  const totalWeight = value.criteria.reduce((total, criterion) => total + criterion.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.001) {
    context.addIssue({
      code: "custom",
      path: ["criteria"],
      message: "Os pesos dos criterios devem somar 100%.",
    });
  }
  const normalizedNames = value.criteria.map((criterion) => criterion.name.toLowerCase());
  if (new Set(normalizedNames).size !== normalizedNames.length) {
    context.addIssue({
      code: "custom",
      path: ["criteria"],
      message: "Nao repita criterios.",
    });
  }
});

const CompetitionIdParams = z.object({ competitionId: z.string().uuid() });
const CompetitionProjectParams = CompetitionIdParams.extend({
  projectId: z.string().uuid(),
});
const EventEvaluationBodySchema = z.object({
  scores: z.array(z.object({
    criterionId: z.string().min(1),
    score: z.number().int().min(1).max(5),
  })).min(1).max(8).refine(
    (scores) => new Set(scores.map((score) => score.criterionId)).size === scores.length,
    "Nao repita criterios na mesma avaliacao.",
  ),
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
type EventEvaluationRequest = FastifyRequest<{
  Params: z.infer<typeof CompetitionProjectParams>;
  Body: z.infer<typeof EventEvaluationBodySchema>;
}>;

const competitonRouteSchema = {
  create: { body: CreateCompetitionBodySchema },
  id: { params: CompetitionIdParams },
  project: { params: CompetitionProjectParams },
  evaluation: {
    params: CompetitionProjectParams,
    body: EventEvaluationBodySchema,
  },
};

export {
  competitonRouteSchema,
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
  CompetitionProjectRequest,
  EventEvaluationRequest,
};
