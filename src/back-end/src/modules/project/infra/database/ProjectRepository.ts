import { InternalServerError } from "@shared/error/HttpError";
import { prisma } from "@infrastructure/config/Prisma";
import { Prisma } from "@prisma/client";
import { Project } from "@project/domain/entities/Project";
import { ProjectMapper } from "@project/application/ProjectMapper";
import { IProjectRepository } from "@project/domain/interfaces/IProjectRepository";
import { ProjectContract } from "@shared/contracts/ProjectContracts";

export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    try {
      const model = await prisma.project.create({
        data: {
          ...ProjectMapper.fromDomainToPrisma(project),
          id: undefined,
        },
      });
      return ProjectMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel salvar o trabalho! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel salvar o trabalho!");
    }
  }

  async update(project: Project): Promise<Project> {
    try {
      const model = await prisma.project.update({
        where: {
          id: project.getId(),
        },
        data: {
          ...ProjectMapper.fromDomainToPrisma(project),
        },
      });
      return ProjectMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel atualizar o trabalho! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel atualizar o trabalho!");
    }
  }

  async delete(id: string): Promise<Project> {
    try {
      const model = await prisma.project.delete({ where: { id } });
      return ProjectMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel deletar o trabalho! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel deletar o trabalho!");
    }
  }

  async findMany(): Promise<Project[]> {
    const models = await prisma.project.findMany();
    return models.map(ProjectMapper.fromPrismaToDomain);
  }

  async findById(id: string): Promise<Project | null> {
    const model = await prisma.project.findUnique({
      where: {
        id,
      },
    });
    return model ? ProjectMapper.fromPrismaToDomain(model) : null;
  }

  async findByPortfolio(portfolioId: string): Promise<ProjectContract[]> {
    const models = await prisma.project.findMany({
      where: {
        portfolioId: portfolioId,
      },
    });
    return models.map(ProjectMapper.fromPrismaToContracts);
  }
}
