import PrismaUser from "../../Entities/PrismaUser";
import { prisma } from "../../../../Infrastructure/Config/prisma";
import { HttpError } from "../../../../Infrastructure/Error/HttpError";

export const PrismaUserRepository = {
  insert: async (prismaUser: PrismaUser): Promise<PrismaUser> => {
    try {
      const user = prisma.user.create({
        data: {
          name: prismaUser.name,
          email: prismaUser.email,
          passWord: prismaUser.passWord,
          status: prismaUser.status,
        },
      });
      return user;
    } catch (error) {
      throw new HttpError(500, "Erro ao registrar usuario!");
    }
  },
  findMany: async (): Promise<PrismaUser[]> => {
    return prisma.user.findMany();
  },
  findById: async (id: string): Promise<PrismaUser | null> => {
    return prisma.user.findUnique({ where: { id } });
  },
  findByEmail: async (email: string): Promise<PrismaUser | null> => {
    return prisma.user.findUnique({ where: { email } });
  },
  deleteById: async (id: string): Promise<PrismaUser | null> => {
    try {
      const userDelete = await prisma.user.delete({
        where: { id },
      });
      return userDelete;
    } catch (error) {
      console.log("Id: ", id, "\n");
      // console.log(error);
      throw new HttpError(500, "Não foi possivel deletar usuario!");
    }
  },
};
