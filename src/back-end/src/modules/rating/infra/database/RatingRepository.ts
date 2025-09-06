import { prisma } from "@infrastructure/config/Prisma";
import { Prisma } from "@prisma/client";
import { RatingMapper } from "@rating/application/RatingMapper";
import { Rating } from "@rating/domain/entities/Rating";
import { IRatingRepository } from "@rating/domain/interfaces/IRatingRepository";
import { InternalServerError } from "@shared/error/HttpError";

export class RatingRepository implements IRatingRepository {
  async create(rating: Rating): Promise<Rating> {
    try {
      const model = await prisma.rating.create({
        data: { ...RatingMapper.fromDomainToPrisma(rating), id: undefined },
      });

      return RatingMapper.fromPrismaToDomin(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel salvar a avaliação! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao registrar avaliação!");
    }
  }

  async update(rating: Rating): Promise<Rating> {
    try {
      const model = await prisma.rating.update({
        where: {
          id: rating.getId(),
        },
        data: {
          ...RatingMapper.fromDomainToPrisma(rating),
        },
      });

      return RatingMapper.fromPrismaToDomin(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi atualizar a avaliação! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao atualizar avaliação!");
    }
  }

  async delete(id: string): Promise<Rating | null> {
    try {
      const model = await prisma.rating.delete({ where: { id: id } });

      return model ? RatingMapper.fromPrismaToDomin(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi deletar a avaliação! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao deletar avaliação!");
    }
  }

  async findById(id: string): Promise<Rating | null> {
    try {
      const model = await prisma.rating.findUnique({ where: { id: id } });

      return model ? RatingMapper.fromPrismaToDomin(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi buscar a avaliação! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao buscar avaliação!");
    }
  }

  async findByUserCompetitionProject(
    userId: string,
    competitionId: string,
    projectId: string
  ): Promise<Rating | null> {
    try {
      const model = await prisma.rating.findUnique({
        where: {
          userId_competitionId_projectId: { userId, competitionId, projectId },
        },
      });

      return model ? RatingMapper.fromPrismaToDomin(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi buscar a avaliação! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao buscar avaliação!");
    }
  }
}
