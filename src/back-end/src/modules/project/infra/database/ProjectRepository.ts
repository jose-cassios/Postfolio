import { InternalServerError } from "@shared/error/HttpError";
import { prisma } from "@infrastructure/config/Prisma";
import { Prisma, ProjectStatus } from "@PrismaGen/client";
import { Project } from "@project/domain/entities/Project";
import { ProjectMapper } from "@project/application/ProjectMapper";
import { IProjectRepository } from "@project/domain/interfaces/IProjectRepository";
import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { ProjectListQuery } from "@project/api/ProjectDTO";
import {
  PaginatedProjectsContract,
  ProjectContactContract,
  ProjectInteractionContract,
  ProjectFeedbackContract,
} from "@shared/contracts/ProjectContracts";
import { ProjectCategoryMapper } from "@project/application/ProjectMapper";

export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    try {
      const model = await prisma.project.create({
        data: {
          ...ProjectMapper.fromDomainToPrisma(project),
          id: undefined,
          contentBlocks: project.getContentBlocks() as unknown as Prisma.InputJsonValue,
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
          contentBlocks: project.getContentBlocks() as unknown as Prisma.InputJsonValue,
          updatedAt: new Date(),
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
    const models = await prisma.project.findMany({
      where: { status: ProjectStatus.PUBLISHED },
    });
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
        status: ProjectStatus.PUBLISHED,
      },
      orderBy: { publishedAt: "desc" },
    });
    return models.map(ProjectMapper.fromPrismaToContracts);
  }

  async findByOwner(userId: string): Promise<ProjectContract[]> {
    const models = await prisma.project.findMany({
      where: { portfolio: { authorId: userId } },
      orderBy: { updatedAt: "desc" },
    });
    return models.map(ProjectMapper.fromPrismaToContracts);
  }

  async findLatestByPortfolio(portfolioId: string): Promise<Project | null> {
    const model = await prisma.project.findFirst({
      where: { portfolioId, status: ProjectStatus.PUBLISHED },
      orderBy: { publishedAt: "desc" },
    });
    return model ? ProjectMapper.fromPrismaToDomain(model) : null;
  }

  async findPublicMany(
    query: ProjectListQuery
  ): Promise<PaginatedProjectsContract> {
    const where: Prisma.ProjectWhereInput = {
      status: ProjectStatus.PUBLISHED,
      ...(query.category && {
        category: ProjectCategoryMapper.fromDomainToPrisma(query.category),
      }),
      ...(query.tool && { tools: { has: query.tool } }),
      ...(query.tag && { tags: { has: query.tag } }),
      ...(query.q && {
        OR: [
          { name: { contains: query.q, mode: "insensitive" } },
          { description: { contains: query.q, mode: "insensitive" } },
          { portfolio: { author: { username: { contains: query.q, mode: "insensitive" } } } },
        ],
      }),
    };

    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      query.sort === "likes"
        ? { likes: { _count: "desc" } }
        : query.sort === "appreciates"
          ? { AppreciateProjectDetails: { appreciateCount: "desc" } }
          : { publishedAt: "desc" };

    const [models, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          portfolio: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  bio: true,
                  availableForHire: true,
                },
              },
            },
          },
          AppreciateProjectDetails: true,
          _count: {
            select: {
              likes: true,
              Comments: true,
              FavorateProjects: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      data: models.map((model) => ({
        ...ProjectMapper.fromPrismaToContracts(model),
        author: model.portfolio.author,
        metrics: {
          likes: model._count.likes,
          appreciates: model.AppreciateProjectDetails?.appreciateCount ?? 0,
          comments: model._count.Comments,
          saves: model._count.FavorateProjects,
        },
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findPublicById(id: string): Promise<ProjectContract | null> {
    const model = await prisma.project.findUnique({
      where: { id, status: ProjectStatus.PUBLISHED },
      include: {
        portfolio: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                bio: true,
                availableForHire: true,
              },
            },
          },
        },
        AppreciateProjectDetails: true,
        Feedback: {
          where: { type: "PUBLIC" },
          select: {
            id: true,
            content: true,
            user: { select: { username: true } },
          },
        },
        _count: {
          select: { likes: true, Comments: true, FavorateProjects: true },
        },
      },
    });
    if (!model) return null;

    return {
      ...ProjectMapper.fromPrismaToContracts(model),
      author: model.portfolio.author,
      metrics: {
        likes: model._count.likes,
        appreciates: model.AppreciateProjectDetails?.appreciateCount ?? 0,
        comments: model._count.Comments,
        saves: model._count.FavorateProjects,
      },
      publicFeedback: model.Feedback.map((feedback) => ({
        id: feedback.id,
        content: feedback.content,
        username: feedback.user.username,
      })),
    };
  }

  async findOwnerContact(projectId: string): Promise<ProjectContactContract | null> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        status: ProjectStatus.PUBLISHED,
        portfolio: { author: { availableForHire: true } },
      },
      select: {
        portfolio: {
          select: {
            author: {
              select: {
                username: true,
                email: true,
                linkedin: true,
                github: true,
                website: true,
              },
            },
          },
        },
      },
    });
    if (!project) return null;
    const author = project.portfolio.author;
    return {
      username: author.username,
      email: author.email,
      linkedin: author.linkedin,
      github: author.github,
      website: author.website,
    };
  }

  async setLike(
    projectId: string,
    userId: string,
    liked: boolean
  ): Promise<ProjectInteractionContract> {
    if (liked) {
      await prisma.like.upsert({
        where: { userId_projectId: { userId, projectId } },
        update: {},
        create: { userId, projectId },
      });
    } else {
      await prisma.like.deleteMany({ where: { userId, projectId } });
    }
    return this.getInteraction(projectId, userId);
  }

  async setAppreciation(
    projectId: string,
    userId: string,
    appreciated: boolean,
    feedback?: { content: string; type: "PUBLIC" | "PRIVATE" }
  ): Promise<ProjectInteractionContract> {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.appreciate.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });

      if (!appreciated) {
        if (existing) {
          await tx.feedback.deleteMany({ where: { appreciateId: existing.id } });
          await tx.appreciate.delete({ where: { id: existing.id } });
          await tx.postMetrics.updateMany({
            where: { projectId, appreciateCount: { gt: 0 } },
            data: { appreciateCount: { decrement: 1 } },
          });
        }
        return;
      }

      const metrics = await tx.postMetrics.upsert({
        where: { projectId },
        update: {},
        create: { projectId, appreciateCount: 0 },
      });

      const appreciation = existing ?? await tx.appreciate.create({
        data: { userId, projectId, postMetricsId: metrics.id },
      });

      if (!existing) {
        await tx.postMetrics.update({
          where: { id: metrics.id },
          data: { appreciateCount: { increment: 1 } },
        });
      }

      if (feedback) {
        await tx.feedback.deleteMany({ where: { appreciateId: appreciation.id } });
        await tx.feedback.create({
          data: {
            content: feedback.content,
            type: feedback.type,
            userId,
            projectId,
            appreciateId: appreciation.id,
          },
        });
      }
    });
    return this.getInteraction(projectId, userId);
  }

  async getInteraction(
    projectId: string,
    userId: string
  ): Promise<ProjectInteractionContract> {
    const [liked, appreciated, saved, likes, metrics] = await Promise.all([
      prisma.like.findUnique({ where: { userId_projectId: { userId, projectId } } }),
      prisma.appreciate.findUnique({ where: { userId_projectId: { userId, projectId } } }),
      prisma.favorateProjects.findUnique({ where: { userId_projectId: { userId, projectId } } }),
      prisma.like.count({ where: { projectId } }),
      prisma.postMetrics.findUnique({ where: { projectId } }),
    ]);
    return {
      liked: Boolean(liked),
      appreciated: Boolean(appreciated),
      saved: Boolean(saved),
      likes,
      appreciates: metrics?.appreciateCount ?? 0,
    };
  }

  async isOwnedBy(projectId: string, userId: string): Promise<boolean> {
    return Boolean(await prisma.project.findFirst({
      where: {
        id: projectId,
        status: ProjectStatus.PUBLISHED,
        portfolio: { authorId: userId },
      },
      select: { id: true },
    }));
  }

  async findPrivateFeedback(projectId: string): Promise<ProjectFeedbackContract[]> {
    const feedback = await prisma.feedback.findMany({
      where: { projectId, type: "PRIVATE" },
      orderBy: { id: "desc" },
      select: {
        id: true,
        content: true,
        user: { select: { username: true } },
      },
    });
    return feedback.map((item) => ({
      id: item.id,
      content: item.content,
      username: item.user.username,
    }));
  }
}
