import { FastifyRequest } from "fastify";
import { z } from "zod";

const CreateUserBodySchema = z.object({
  name: z
    .string({ message: "O nome é obrigatorio" })
    .min(3, "O nome é muito curto")
    .max(100, "O nome é muito longo"),
  email: z
    .string({ message: "O email é obrigatorio" })
    .email({ message: "Email invalido" }),
  password: z
    .string({ message: "A senha é obrigatoria" })
    .min(8, "Senha muito curta")
    .max(100, "Senha muito longa"),
  status: z.string(),
});

type RegisterUserRequest = FastifyRequest<{
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

const userRouteSchema = {
  create: {
    body: CreateUserBodySchema,
  },
  login: {
    body: LoginUserBodySchema,
  },
};

export { userRouteSchema, RegisterUserRequest, LoginRequest };
