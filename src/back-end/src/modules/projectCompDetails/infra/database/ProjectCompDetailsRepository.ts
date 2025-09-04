import { prisma } from "@infrastructure/config/Prisma";
import { Prisma } from "@prisma/client";
import { ProjectCompDetailsMapper } from "@projectCompDetails/application/ProjectCompDetailsMapper";
import { ProjectCompDetails } from "@projectCompDetails/domain/entitite/ProjectCompDetails";
import { IProjectCompDetailsRepository } from "@projectCompDetails/domain/interfaces/IProjectCompDetailsRepository";
import { InternalServerError } from "@shared/error/HttpError";

export class ProjectCompDetailsRepository
  implements IProjectCompDetailsRepository
{
  async create(
    projectCompDetails: ProjectCompDetails
  ): Promise<ProjectCompDetails> {
    try {
      const model = await prisma.projectCompDetails.create({
        data: {
          ...ProjectCompDetailsMapper.fromDomainToPrisma(projectCompDetails),
          id: undefined,
        },
      });

      return ProjectCompDetailsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel registrar o projeto na competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro resgistrar o projeto na competição!");
    }
  }

  async update(
    projectCompDetails: ProjectCompDetails
  ): Promise<ProjectCompDetails> {
    try {
      const model = await prisma.projectCompDetails.update({
        where: {
          id: projectCompDetails.id,
        },
        data: {
          ...ProjectCompDetailsMapper.fromDomainToPrisma(projectCompDetails),
        },
      });

      return ProjectCompDetailsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel atualizar o projeto da competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro atualizar o projeto da competição!");
    }
  }

  async delete(
    competitionId: string,
    projectId: string
  ): Promise<ProjectCompDetails> {
    try {
      const model = await prisma.projectCompDetails.delete({
        where: {
          competitionId_projectId: {
            competitionId,
            projectId,
          },
        },
      });

      return ProjectCompDetailsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel deletar o projeto da competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro deletar o projeto da competição!");
    }
  }

  async findById(id: string): Promise<ProjectCompDetails | null> {
    try {
      const model = await prisma.projectCompDetails.findUnique({
        where: {
          id,
        },
      });

      return model ? ProjectCompDetailsMapper.fromPrismaToDomain(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel busca os detalhes do projeto! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro os detalhes do projeto!");
    }
  }

  async findByCompetitionIdAndPortfolioId(
    competitionId: string,
    projectId: string
  ): Promise<ProjectCompDetails | null> {
    try {
      const model = await prisma.projectCompDetails.findUnique({
        where: {
          competitionId_projectId: {
            competitionId,
            projectId,
          },
        },
      });

      return model ? ProjectCompDetailsMapper.fromPrismaToDomain(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel busca os detalhes do projeto! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro os detalhes do projeto!");
    }
  }
}
