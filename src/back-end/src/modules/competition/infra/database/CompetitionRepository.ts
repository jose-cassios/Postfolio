import { InternalServerError } from "@shared/error/HttpError";
import { prisma } from "@infrastructure/config/prisma";
import { Prisma } from "@prisma/client";
import { Competition } from "@competition/domain/entities/Competition";
import { CompetitionMapper } from "@competition/application/CompetitionMapper";
import { ICompetitionRepository } from "@competition/domain/interfaces/ICompetitionRepository";
Competition;

export class PrismaCompetitionRepository implements ICompetitionRepository {
  async create(competition: Competition): Promise<Competition> {
    try {
      const model = await prisma.competition.create({
        data: {
          ...CompetitionMapper.fromDomainToPrisma(competition),
          id: undefined,
        },
      });
      return CompetitionMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel salvar a competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel salvar a competição!");
    }
  }

  async update(competition: Competition): Promise<Competition> {
    try {
      const competitionModel = await prisma.competition.update({
        where: {
          id: competition.id,
        },
        data: { ...CompetitionMapper.fromDomainToPrisma(competition) },
      });
      return CompetitionMapper.fromPrismaToDomain(competitionModel);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel atualizar a competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel atualizar a competição!");
    }
  }

  async deleteById(id: string): Promise<Competition | null> {
    try {
      const competitionModel = await prisma.competition.delete({
        where: {
          id,
        },
      });
      return CompetitionMapper.fromPrismaToDomain(competitionModel);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel deletar a competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel deletar a competição!");
    }
  }

  async findMany(): Promise<Competition[]> {
    const competitionModels = await prisma.competition.findMany();
    return competitionModels.map(CompetitionMapper.fromPrismaToDomain);
  }

  async findById(id: string): Promise<Competition | null> {
    const competitionModel = await prisma.competition.findUnique({
      where: {
        id,
      },
    });

    return competitionModel
      ? CompetitionMapper.fromPrismaToDomain(competitionModel)
      : null;
  }
}
