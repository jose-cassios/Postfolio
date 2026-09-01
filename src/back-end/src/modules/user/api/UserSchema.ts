import { FastifyRequest } from "fastify";
import { z } from "zod";

const normalizeHttpUrl = (value: unknown): unknown => {
  if (typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  return /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;
};

const optionalHttpUrl = (fieldName: string) =>
  z.preprocess(
    normalizeHttpUrl,
    z
      .string()
      .url({
        message: `O link de ${fieldName} deve ser uma URL valida`,
        protocol: /^https?$/,
      })
      .nullable()
      .optional(),
  );

const CreateUserBodySchema = z.object({
  username: z
    .string({ message: "O nome é obrigatorio" })
    .min(3, "O nome é muito curto")
    .max(100, "O nome é muito longo"),
  email: z.string({ message: "O email é obrigatorio" }),
  password: z
    .string({ message: "A senha é obrigatoria" })
    .min(8, "Senha muito curta")
    .max(100, "Senha muito longa"),
  bio: z.string().max(200).optional(),
  linkedin: optionalHttpUrl("LinkedIn"),
  github: optionalHttpUrl("GitHub"),
  website: optionalHttpUrl("website"),
  profilePhoto: optionalHttpUrl("foto de perfil"),
  coverPhoto: optionalHttpUrl("imagem de capa"),
  availableForHire: z.boolean().optional(),
  usertype: z.literal("USER"),
});

type CreateUserRequest = FastifyRequest<{
  Body: z.infer<typeof CreateUserBodySchema>;
}>;

const LoginUserBodySchema = z.object({
  email: z
    .string({ message: "O email é obrigatório" })
    .email("O email é invalido"),
  password: z.string({ message: "A senha é obrigatória" }),
});

type LoginRequest = FastifyRequest<{
  Body: z.infer<typeof LoginUserBodySchema>;
}>;

const UpdateUserBodySchema = CreateUserBodySchema.omit({
  password: true,
  usertype: true,
})
  .extend({
    linkedin: optionalHttpUrl("LinkedIn"),
    github: optionalHttpUrl("GitHub"),
    website: optionalHttpUrl("website"),
    profilePhoto: optionalHttpUrl("foto de perfil"),
    coverPhoto: optionalHttpUrl("imagem de capa"),
    availableForHire: z.boolean(),
  })
  .partial();

const UpdateUserParamsSchema = z.object({
  id: z.string().uuid("ID do user inválido"),
});

const UpdateUserRoleBodySchema = z.object({
  usertype: z.enum(["USER", "MODERATOR", "ADMIN"]),
});

const ReputationRankSchema = z.enum([
  "F", "F+", "E", "E+", "D", "D+", "C", "C+", "B", "B+", "A", "A+", "S", "SS",
]);
const UpdateReputationRankConfigBodySchema = z.object({
  ranks: z.array(z.object({
    rank: ReputationRankSchema,
    requiredXp: z.number().int().min(0),
  })).length(14),
}).superRefine(({ ranks }, context) => {
  const expected = ["F", "F+", "E", "E+", "D", "D+", "C", "C+", "B", "B+", "A", "A+", "S", "SS"];
  if (new Set(ranks.map((rank) => rank.rank)).size !== expected.length) {
    context.addIssue({ code: "custom", path: ["ranks"], message: "Informe cada rank uma unica vez." });
    return;
  }
  let previousXp = -1;
  for (const rank of expected) {
    const item = ranks.find((candidate) => candidate.rank === rank);
    if (!item) {
      context.addIssue({ code: "custom", path: ["ranks"], message: "Informe todos os ranks." });
      return;
    }
    if (rank === "F" && item.requiredXp !== 0) {
      context.addIssue({ code: "custom", path: ["ranks"], message: "O rank F deve permanecer em 0 XP." });
    }
    if (item.requiredXp <= previousXp) {
      context.addIssue({ code: "custom", path: ["ranks"], message: "Cada rank deve exigir mais XP que o anterior." });
    }
    previousXp = item.requiredXp;
  }
});

const ReputationAxisSchema = z.enum(["CREATOR", "CONTRIBUTOR"]);
const AdminReputationAdjustmentBodySchema = z.object({
  axis: ReputationAxisSchema,
  points: z.number().int().refine((value) => value !== 0, "O ajuste deve ser diferente de zero."),
  reason: z.string().trim().min(3, "Informe o motivo do ajuste.").max(500),
  idempotencyKey: z.string().trim().min(16).max(120),
});
const ReputationEventParamsSchema = z.object({
  eventId: z.string().uuid("ID do evento de reputacao invalido"),
});
const ReputationReversalBodySchema = z.object({
  reason: z.string().trim().min(3, "Informe o motivo da reversao.").max(500),
});

type UpdateUserRequest = FastifyRequest<{
  Params: z.infer<typeof UpdateUserParamsSchema>;
  Body: z.infer<typeof UpdateUserBodySchema>;
}>;

type UpdateUserRoleRequest = FastifyRequest<{
  Params: z.infer<typeof UpdateUserParamsSchema>;
  Body: z.infer<typeof UpdateUserRoleBodySchema>;
}>;

type UpdateReputationRankConfigRequest = FastifyRequest<{
  Body: z.infer<typeof UpdateReputationRankConfigBodySchema>;
}>;

type AdminReputationAdjustmentRequest = FastifyRequest<{
  Params: z.infer<typeof UpdateUserParamsSchema>;
  Body: z.infer<typeof AdminReputationAdjustmentBodySchema>;
}>;

type ReputationReversalRequest = FastifyRequest<{
  Params: z.infer<typeof ReputationEventParamsSchema>;
  Body: z.infer<typeof ReputationReversalBodySchema>;
}>;

const PublicProfileParamsSchema = z.object({
  username: z.string().min(3).max(100),
});

type PublicProfileRequest = FastifyRequest<{
  Params: z.infer<typeof PublicProfileParamsSchema>;
}>;

const userRouteSchema = {
  create: {
    body: CreateUserBodySchema,
  },
  update: {
    params: UpdateUserParamsSchema,
    body: UpdateUserBodySchema,
  },
  updateRole: {
    params: UpdateUserParamsSchema,
    body: UpdateUserRoleBodySchema,
  },
  reputationRankConfig: {
    body: UpdateReputationRankConfigBodySchema,
  },
  reputationAdjustment: {
    params: UpdateUserParamsSchema,
    body: AdminReputationAdjustmentBodySchema,
  },
  reputationHistory: {
    params: UpdateUserParamsSchema,
  },
  reputationReversal: {
    params: ReputationEventParamsSchema,
    body: ReputationReversalBodySchema,
  },
  login: {
    body: LoginUserBodySchema,
  },
  publicProfile: {
    params: PublicProfileParamsSchema,
  },
};

export {
  userRouteSchema,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
  UpdateReputationRankConfigRequest,
  AdminReputationAdjustmentRequest,
  ReputationReversalRequest,
  LoginRequest,
  PublicProfileRequest,
};
