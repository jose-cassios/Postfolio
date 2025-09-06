import { prisma } from "@infrastructure/config/prisma";
import { PostMetricsMapper } from "@postMetrics/application/PostMetricsMapper";
import { PostMetrics } from "@postMetrics/domain/entities/PostMetrics";
import { IPostMetricsRepository } from "@postMetrics/domain/interfaces/IPostMetricsRepository";
import { Prisma } from "@prisma/client";
import { InternalServerError } from "@shared/error/HttpError";

export class PostMetricsRepository implements IPostMetricsRepository {
  async create(postMetrcis: PostMetrics): Promise<PostMetrics> {
    try {
      const model = await prisma.postMetrics.create({
        data: {
          ...PostMetricsMapper.fromDomainToPrisma(postMetrcis),
          id: undefined,
        },
      });

      return PostMetricsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel salvar as metricas! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao registrar metricas!");
    }
  }

  async update(postMetrcis: PostMetrics): Promise<PostMetrics> {
    try {
      const model = await prisma.postMetrics.update({
        where: {
          id: postMetrcis.getId(),
        },
        data: {
          ...PostMetricsMapper.fromDomainToPrisma(postMetrcis),
        },
      });

      return PostMetricsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel atualizar as metricas! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao atualizar metricas!");
    }
  }

  async delete(postMetrcis: PostMetrics): Promise<PostMetrics> {
    try {
      const model = await prisma.postMetrics.delete({
        where: {
          id: postMetrcis.getId(),
        },
      });

      return PostMetricsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel deletar as metricas! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao deletar metricas!");
    }
  }

  async findById(id: string): Promise<PostMetrics | null> {
    const model = await prisma.postMetrics.findUnique({
      where: {
        id,
      },
    });

    return model ? PostMetricsMapper.fromPrismaToDomain(model) : null;
  }

  async findByProjectId(projectId: string): Promise<PostMetrics | null> {
    const model = await prisma.postMetrics.findUnique({
      where: {
        projectId,
      },
    });

    return model ? PostMetricsMapper.fromPrismaToDomain(model) : null;
  }
}
