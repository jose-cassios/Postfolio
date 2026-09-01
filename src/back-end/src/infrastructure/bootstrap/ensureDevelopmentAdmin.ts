import { Prisma, UserType } from "@PrismaGen/client";
import { prisma } from "@infrastructure/config/Prisma";
import { Crypt } from "@shared/util/Crypto";

const DEVELOPMENT_ADMIN = {
  email: "admin@gmail.com",
  password: "admin",
  username: "admin",
  bio: "Administrador de desenvolvimento.",
} as const;

function shouldBootstrapDevelopmentAdmin(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test";
}

/**
 * Cria a conta administrativa local somente quando ainda não existe nenhum ADMIN.
 * A conta nunca é criada ou alterada em produção.
 */
export async function ensureDevelopmentAdmin(): Promise<void> {
  if (!shouldBootstrapDevelopmentAdmin()) return;

  const existingAdmin = await prisma.user.findFirst({
    where: { userType: UserType.ADMIN },
    select: { id: true },
  });
  if (existingAdmin) return;

  try {
    await prisma.user.create({
      data: {
        email: DEVELOPMENT_ADMIN.email,
        password: await Crypt.hashPassWord(DEVELOPMENT_ADMIN.password),
        username: DEVELOPMENT_ADMIN.username,
        bio: DEVELOPMENT_ADMIN.bio,
        userType: UserType.ADMIN,
        active: true,
      },
    });
    console.info("[development] Conta administrativa local criada.");
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const adminCreatedConcurrently = await prisma.user.findFirst({
        where: { userType: UserType.ADMIN },
        select: { id: true },
      });
      if (adminCreatedConcurrently) return;

      console.warn(
        "[development] Não foi possível criar a conta administrativa: o e-mail configurado já está em uso.",
      );
      return;
    }
    throw error;
  }
}
