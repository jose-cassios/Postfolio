import { FastifyRequest } from "fastify";
import { z } from "zod";

const HttpUrlSchema = z
  .string()
  .url({ message: "Informe uma URL HTTP valida", protocol: /^https?$/ });
const DraftUrlSchema = z.union([z.literal(""), HttpUrlSchema]);

const BlockIdSchema = z.string().trim().min(1).max(80);
const MediaWidthSchema = z.enum(["STANDARD", "WIDE", "FULL"]);
const FeedbackAspectSchema = z.enum([
  "UI",
  "UX",
  "ARCHITECTURE",
  "CODE",
  "PERFORMANCE",
  "ACCESSIBILITY",
  "ORIGINALITY",
  "DOCUMENTATION",
]);

const TextBlockSchema = z.object({
  id: BlockIdSchema,
  type: z.literal("TEXT"),
  content: z.string().max(5_000, "O bloco de texto e muito longo"),
  variant: z.enum(["TITLE", "HEADING", "BODY", "QUOTE"]).default("BODY"),
  alignment: z.enum(["LEFT", "CENTER", "RIGHT"]).default("LEFT"),
  bold: z.boolean().default(false),
  italic: z.boolean().default(false),
});

const ImageBlockSchema = z.object({
  id: BlockIdSchema,
  type: z.literal("IMAGE"),
  url: DraftUrlSchema,
  alt: z.string().trim().max(160).default(""),
  caption: z.string().trim().max(240).default(""),
  width: MediaWidthSchema.default("WIDE"),
});

const VideoBlockSchema = z.object({
  id: BlockIdSchema,
  type: z.literal("VIDEO"),
  url: DraftUrlSchema,
  posterUrl: DraftUrlSchema.nullable().optional().default(null),
  caption: z.string().trim().max(240).default(""),
  width: MediaWidthSchema.default("WIDE"),
});

const CarouselBlockSchema = z.object({
  id: BlockIdSchema,
  type: z.literal("CAROUSEL"),
  items: z
    .array(z.object({
      url: DraftUrlSchema,
      alt: z.string().trim().max(160).default(""),
    }))
    .max(10, "O carrossel aceita no maximo dez imagens"),
  caption: z.string().trim().max(240).default(""),
  width: MediaWidthSchema.default("WIDE"),
});

const ProjectBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ImageBlockSchema,
  VideoBlockSchema,
  CarouselBlockSchema,
]);

const ProjectBodyFields = z.object({
  name: z.string().trim().max(100, "Nome muito longo"),
  description: z.string().trim().max(500, "Descricao muito longa").default(""),
  category: z.enum([
    "FULLSTACK",
    "FRONTEND",
    "BACKEND",
    "DESIGN",
    "MOBILE",
    "DATA_ANALYSIS",
    "OTHER",
  ]),
  githublink: HttpUrlSchema.nullable().optional(),
  externalLink: HttpUrlSchema.nullable().optional(),
  coverImageUrl: HttpUrlSchema.nullable().optional(),
  galleryUrls: z.array(HttpUrlSchema).max(10).default([]),
  tools: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  tags: z.array(z.string().trim().min(1).max(30)).max(20).default([]),
  contentBlocks: z.array(ProjectBlockSchema).max(40).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  feedbackAspects: z
    .array(FeedbackAspectSchema)
    .max(3, "Escolha no maximo tres aspectos")
    .refine((items) => new Set(items).size === items.length, "Nao repita aspectos")
    .default([]),
  feedbackQuestion: z.string().trim().max(240).nullable().optional(),
});

const CreateProjectBodySchema = ProjectBodyFields.superRefine((project, context) => {
  if (project.status === "DRAFT") return;

  if (project.name.length < 3) {
    context.addIssue({
      code: "custom",
      path: ["name"],
      message: "Nome deve ter pelo menos 3 caracteres",
    });
  }

  // Clientes anteriores ao editor não enviam status nem blocos. Durante o
  // rollout eles continuam criando o formato legado como publicado.
  if (project.status === undefined) return;

  if (!project.contentBlocks.length) {
    context.addIssue({
      code: "custom",
      path: ["contentBlocks"],
      message: "Adicione pelo menos um bloco antes de publicar",
    });
  }
  project.contentBlocks.forEach((block, index) => {
    const path = ["contentBlocks", index];
    const isIncomplete =
      (block.type === "TEXT" && !block.content.trim()) ||
      ((block.type === "IMAGE" || block.type === "VIDEO") && !block.url) ||
      (block.type === "CAROUSEL" &&
        block.items.filter((item) => Boolean(item.url)).length < 2);
    if (isIncomplete) {
      context.addIssue({
        code: "custom",
        path,
        message: "Complete ou remova os blocos vazios antes de publicar",
      });
    }
  });
});

type CreateProjectRequest = FastifyRequest<{
  Body: z.infer<typeof CreateProjectBodySchema>;
}>;

const UpdateProjectParamsSchema = z.object({
  projectId: z.string().uuid("ID do trabalho e obrigatorio"),
});

const UpdateProjectBodySchema = ProjectBodyFields.partial()
  .extend({
    changelog: z.string().trim().min(3).max(500).optional(),
    postmarkIds: z.array(z.string().uuid()).max(20).default([]),
  })
  .superRefine((project, context) => {
    if (project.status === "PUBLISHED" && !project.changelog) {
      context.addIssue({
        code: "custom",
        path: ["changelog"],
        message: "Descreva o que mudou nesta versao",
      });
    }
  });

const ProjectListQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum([
    "FULLSTACK", "FRONTEND", "BACKEND", "DESIGN", "MOBILE", "DATA_ANALYSIS", "OTHER",
  ]).optional(),
  tool: z.string().trim().max(40).optional(),
  tag: z.string().trim().max(30).optional(),
  sort: z.enum(["newest", "likes"]).default("newest"),
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
const CreatePostmarkBodySchema = z.object({
  aspect: FeedbackAspectSchema,
  strength: z.string().trim().min(3).max(500),
  suggestion: z.string().trim().min(3).max(500),
  additionalComment: z.string().trim().max(500).nullable().optional(),
});
const PostmarkStatusParamsSchema = z.object({
  projectId: z.string().uuid("ID do projeto invalido"),
  postmarkId: z.string().uuid("ID do Postmark invalido"),
});
const UpdatePostmarkStatusBodySchema = z.object({
  status: z.enum(["USEFUL", "APPLIED", "DISMISSED"]),
});

type SetLikeRequest = FastifyRequest<{
  Params: z.infer<typeof ProjectInteractionParamsSchema>;
  Body: z.infer<typeof SetLikeBodySchema>;
}>;

type CreatePostmarkRequest = FastifyRequest<{
  Params: z.infer<typeof ProjectInteractionParamsSchema>;
  Body: z.infer<typeof CreatePostmarkBodySchema>;
}>;

type UpdatePostmarkStatusRequest = FastifyRequest<{
  Params: z.infer<typeof PostmarkStatusParamsSchema>;
  Body: z.infer<typeof UpdatePostmarkStatusBodySchema>;
}>;

type UpdateProjectRequest = FastifyRequest<{
  Body: z.infer<typeof UpdateProjectBodySchema>;
  Params: z.infer<typeof UpdateProjectParamsSchema>;
}>;

const projectRouteSchema = {
  create: { body: CreateProjectBodySchema },
  update: {
    body: UpdateProjectBodySchema,
    params: UpdateProjectParamsSchema,
  },
  list: { querystring: ProjectListQuerySchema },
  setLike: { params: ProjectInteractionParamsSchema, body: SetLikeBodySchema },
  createPostmark: {
    params: ProjectInteractionParamsSchema,
    body: CreatePostmarkBodySchema,
  },
  postmarkStatus: {
    params: PostmarkStatusParamsSchema,
    body: UpdatePostmarkStatusBodySchema,
  },
  interaction: { params: ProjectInteractionParamsSchema },
};

export {
  projectRouteSchema,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListRequest,
  SetLikeRequest,
  CreatePostmarkRequest,
  UpdatePostmarkStatusRequest,
};
