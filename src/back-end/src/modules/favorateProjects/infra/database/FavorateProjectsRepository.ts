import { FavorateProjectsMapper } from "@favorateProjects/application/FavorateProjectsMapper";
import { FavorateProjects } from "@favorateProjects/domain/entities/FavorateProjects";
import { IFavorateProjectsRepository } from "@favorateProjects/domain/interfaces/IFavorateProjectsRepository";
import { prisma } from "@infrastructure/config/prisma";
import { Prisma } from "@prisma/client";
import { FavorateProjectsContract } from "@shared/contracts/FavorateProjectsContract";
import { InternalServerError } from "@shared/error/HttpError";

export class FavorateProjectsRepository implements IFavorateProjectsRepository {
  async create(favorate: FavorateProjects): Promise<FavorateProjects> {
    try {
      const model = await prisma.favorateProjects.create({
        data: {
          ...FavorateProjectsMapper.fromDomainToPrisma(favorate),
          id: undefined,
        },
      });

      return FavorateProjectsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel favoritar o projeto! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao favoritar projeto!");
    }
  }

  async delete(favorate: FavorateProjects): Promise<FavorateProjects> {
    try {
      const model = await prisma.favorateProjects.delete({
        where: {
          id: favorate.getId(),
        },
      });

      return FavorateProjectsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel remover dos favoritos o projeto! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao remover dos favoritos o projeto!");
    }
  }

  async findByUserId(userId: string): Promise<FavorateProjectsContract[]> {
    try {
      const models = await prisma.favorateProjects.findMany({
        where: {
          userId,
        },
      });

      return models.map(FavorateProjectsMapper.fromPrismaToContract);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel buscar os favoritos do usuario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao buscar os favoritos do usuario!");
    }
  }

  async findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<FavorateProjects | null> {
    try {
      const model = await prisma.favorateProjects.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      return model ? FavorateProjectsMapper.fromPrismaToDomain(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel buscar o projeto favoritado do usuario! Código: ${error.code}`
        );
      }
      throw new InternalServerError(
        "Erro ao buscar o projeto favoritado do usuario!"
      );
    }
  }
}
