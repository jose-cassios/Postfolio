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

type UpdateUserRequest = FastifyRequest<{
  Params: z.infer<typeof UpdateUserParamsSchema>;
  Body: z.infer<typeof UpdateUserBodySchema>;
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
  LoginRequest,
  PublicProfileRequest,
};
