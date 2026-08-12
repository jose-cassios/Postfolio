import { FastifyRequest } from "fastify";
import { z } from "zod";

const CreateProjectBodySchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  description: z.string().max(500, "Descrição muito longa"),
  category: z.enum([
    "FULLSTACK",
    "FRONTEND",
    "BACKEND",
    "DESIGN",
    "MOBILE",
    "DATA_ANALYSIS",
    "OTHER",
  ]),
  githublink: z.string().url("O GitHub deve ser uma URL valida").nullable().optional(),
});

type CreateProjectRequest = FastifyRequest<{
  Body: z.infer<typeof CreateProjectBodySchema>;
}>;

const UpdateProjectParamsSchema = z.object({
  projectId: z.string().uuid("ID do trabalho é obrigatorio"),
});

const UpdateProjectBodySchema = CreateProjectBodySchema.partial();

// const UpdateProjectBodySchema = z.object({
//   name: z
//     .string({ message: "O nome é obrigatorio" })
//     .min(3, "O nome é muito curto")
//     .max(100, "O nome é muito grande"),
//   description: z
//     .string({ message: "A descrição é obrigatorio" })
//     .max(500, "Descrição muito longa"),
//   category: z.enum([
//     "FULLSTACK",
//     "FRONTEND",
//     "BACKEND",
//     "DESIGN",
//     "MOBILE",
//     "DATA_ANALYSIS",
//     "OTHER",
//   ]),
//   githublink: z.string().optional(),
//   portfolio: z.string({ message: "O portfolio é obrigatorio" }).uuid(),
// });

type UpdateProjectRequest = FastifyRequest<{
  Body: z.infer<typeof UpdateProjectBodySchema>;
  Params: z.infer<typeof UpdateProjectParamsSchema>;
}>;

const projectRouteSchema = {
  create: {
    body: CreateProjectBodySchema,
  },
  update: {
    body: UpdateProjectBodySchema,
    params: UpdateProjectParamsSchema,
  },
};

export { projectRouteSchema, CreateProjectRequest, UpdateProjectRequest };
