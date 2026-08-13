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
  externalLink: z.string().url("O link externo deve ser uma URL valida").nullable().optional(),
  coverImageUrl: z.string().url("A capa deve ser uma URL valida").nullable().optional(),
  galleryUrls: z
    .array(z.string().url("Cada imagem deve ser uma URL valida"))
    .max(3, "Use no maximo tres imagens de amostra")
    .default([]),
  tools: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  tags: z.array(z.string().trim().min(1).max(30)).max(20).default([]),
});

type CreateProjectRequest = FastifyRequest<{
  Body: z.infer<typeof CreateProjectBodySchema>;
}>;

const UpdateProjectParamsSchema = z.object({
  projectId: z.string().uuid("ID do trabalho é obrigatorio"),
});

const UpdateProjectBodySchema = CreateProjectBodySchema.partial();

const ProjectListQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum([
    "FULLSTACK", "FRONTEND", "BACKEND", "DESIGN", "MOBILE", "DATA_ANALYSIS", "OTHER",
  ]).optional(),
  tool: z.string().trim().max(40).optional(),
  tag: z.string().trim().max(30).optional(),
  sort: z.enum(["newest", "likes", "appreciates"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

type ProjectListRequest = FastifyRequest<{
  Querystring: z.infer<typeof ProjectListQuerySchema>;
}>;

const ProjectInteractionParamsSchema = z.object({
  projectId: z.string().uuid("ID do projeto invalido"),
});

const SetLikeBodySchema = z.object({ liked: z.boolean() });
const SetAppreciationBodySchema = z.object({
  appreciated: z.boolean(),
  feedback: z
    .object({
      content: z.string().trim().min(1).max(500),
      type: z.enum(["PUBLIC", "PRIVATE"]),
    })
    .optional(),
});

type SetLikeRequest = FastifyRequest<{
  Params: z.infer<typeof ProjectInteractionParamsSchema>;
  Body: z.infer<typeof SetLikeBodySchema>;
}>;

type SetAppreciationRequest = FastifyRequest<{
  Params: z.infer<typeof ProjectInteractionParamsSchema>;
  Body: z.infer<typeof SetAppreciationBodySchema>;
}>;

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
  list: { querystring: ProjectListQuerySchema },
  setLike: { params: ProjectInteractionParamsSchema, body: SetLikeBodySchema },
  setAppreciation: {
    params: ProjectInteractionParamsSchema,
    body: SetAppreciationBodySchema,
  },
  interaction: { params: ProjectInteractionParamsSchema },
};

export {
  projectRouteSchema,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListRequest,
  SetLikeRequest,
  SetAppreciationRequest,
};
