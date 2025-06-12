import PrismaPortfolio from "../../Entities/PrismaPortfolio";
import { prisma } from "../../../../Infrastructure/Config/prisma";
import { HttpError } from "../../../../Infrastructure/Error/HttpError";

export const PrismaPortfolioRepository = {
  insert: async (
    prismaPortfolio: PrismaPortfolio
  ): Promise<PrismaPortfolio> => {
    try {
      const portfolio = await prisma.portfolio.create({
        data: {
          name: prismaPortfolio.name,
          description: prismaPortfolio.description,
          pageLink: prismaPortfolio.pageLink,
          authorId: prismaPortfolio.authorId,
        },
      });
      return portfolio;
    } catch (error) {
      throw new HttpError(500, "Erro ao salvar Portfolio!");
    }
  },
  findMany: async (): Promise<PrismaPortfolio[]> => {
    return await prisma.portfolio.findMany();
  },
  findById: async (id: string): Promise<PrismaPortfolio | null> => {
    return await prisma.portfolio.findUnique({
      where: {
        id,
      },
    });
  },
  findByAuthor: async (authorId: string): Promise<PrismaPortfolio[]> => {
    return await prisma.portfolio.findMany({
      where: { authorId },
    });
  },
  update: async (
    prismaPortfolio: PrismaPortfolio
  ): Promise<PrismaPortfolio> => {
    return await prisma.portfolio.update({
      where: {
        id: prismaPortfolio.id,
      },
      data: {
        name: prismaPortfolio.name,
        description: prismaPortfolio.description,
        pageLink: prismaPortfolio.pageLink,
      },
    });
  },
  deleteById: async (id: string): Promise<PrismaPortfolio | null> => {
    console.log("Aqui 2:", id, "\n");
    try {
      return await prisma.portfolio.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HttpError(500, "Não foi possivel deletar o portfolio!");
    }
  },
};
