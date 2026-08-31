import { BadRequest, Conflict, Forbidden, GenericHttpError, InternalServerError, NotFound } from "@shared/error/HttpError";
import { prisma } from "@infrastructure/config/Prisma";
import {
  AppreciateStatus,
  Prisma,
  Project as PrismaProject,
  ProjectStatus,
  ReputationEventType,
} from "@PrismaGen/client";
import { Project } from "@project/domain/entities/Project";
import { ProjectMapper } from "@project/application/ProjectMapper";
import {
  CreateAppreciationInput,
  IProjectRepository,
  VersionPublication,
} from "@project/domain/interfaces/IProjectRepository";
import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { ProjectListQuery } from "@project/api/ProjectDTO";
import {
  PaginatedProjectsContract,
  ProjectContactContract,
  ProjectInteractionContract,
  ProjectFeedbackContract,
  ProjectAppreciationContract,
} from "@shared/contracts/ProjectContracts";
import { ProjectCategoryMapper } from "@project/application/ProjectMapper";
import { recordReputationEvent } from "@project/application/ReputationPolicy";

export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    try {
      const model = await prisma.$transaction(async (tx) => {
        const created = await tx.project.create({
          data: {
            ...ProjectMapper.fromDomainToPrisma(project),
            id: undefined,
            contentBlocks: project.getContentBlocks() as unknown as Prisma.InputJsonValue,
          },
        });
        if (created.status !== ProjectStatus.PUBLISHED) return created;

        const portfolio = await tx.portfolio.findUniqueOrThrow({
          where: { id: created.portfolioId },
          select: { authorId: true },
        });
        await tx.projectVersion.create({
          data: this.versionSnapshot(created, 1, "Versao inicial", portfolio.authorId),
        });
        return await tx.project.update({
          where: { id: created.id },
          data: { currentVersion: 1 },
        });
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

  async update(project: Project, publication?: VersionPublication): Promise<Project> {
    try {
      const model = await prisma.$transaction(async (tx) => {
        const current = await tx.project.findUniqueOrThrow({
          where: { id: project.getId() },
          select: { currentVersion: true },
        });
        const nextVersion = publication ? current.currentVersion + 1 : current.currentVersion;
        const updated = await tx.project.update({
          where: { id: project.getId() },
          data: {
            ...ProjectMapper.fromDomainToPrisma(project),
            currentVersion: nextVersion,
            contentBlocks: project.getContentBlocks() as unknown as Prisma.InputJsonValue,
            updatedAt: new Date(),
          },
        });
        if (!publication) return updated;

        const previousVersion = await tx.projectVersion.findFirst({
          where: { projectId: updated.id },
          orderBy: { versionNumber: "desc" },
        });
        if (previousVersion && !this.hasSnapshotChanges(updated, previousVersion)) {
          throw new BadRequest("Altere o conteudo do projeto antes de publicar outra versao.");
        }

        const appreciations = publication.appreciationIds.length
          ? await tx.appreciate.findMany({
              where: {
                id: { in: publication.appreciationIds },
                projectId: updated.id,
              },
              include: {
                versionCredits: {
                  select: { projectVersion: { select: { versionNumber: true } } },
                },
              },
            })
          : [];
        if (appreciations.length !== publication.appreciationIds.length) {
          throw new BadRequest("Um dos Appreciates selecionados nao pertence ao projeto.");
        }
        if (appreciations.some((appreciation) => appreciation.versionCredits.length)) {
          throw new BadRequest("Um dos Appreciates ja recebeu credito em outra versao.");
        }
        if (appreciations.some((appreciation) => appreciation.status === AppreciateStatus.DISMISSED)) {
          throw new BadRequest("Um Appreciate descartado nao pode receber credito.");
        }
        if (appreciations.some((appreciation) => appreciation.userId === publication.authorId)) {
          throw new Forbidden("O autor nao pode gerar credito de contribuicao para si mesmo.");
        }

        const version = await tx.projectVersion.create({
          data: this.versionSnapshot(
            updated,
            nextVersion,
            publication.changelog,
            publication.authorId,
          ),
        });

        for (const appreciation of appreciations) {
          await tx.projectVersionCredit.create({
            data: {
              projectVersionId: version.id,
              appreciationId: appreciation.id,
              contributorId: appreciation.userId,
            },
          });
          await tx.appreciate.update({
            where: { id: appreciation.id },
            data: { status: AppreciateStatus.APPLIED, resolvedAt: new Date() },
          });
          await recordReputationEvent(tx, {
            userId: appreciation.userId,
            type: ReputationEventType.APPRECIATION_APPLIED,
            idempotencyKey: `appreciation-applied:${appreciation.id}`,
            projectId: updated.id,
            appreciationId: appreciation.id,
            projectVersionId: version.id,
          });
        }

        if (nextVersion > 1) {
          await recordReputationEvent(tx, {
            userId: publication.authorId,
            type: ReputationEventType.PROJECT_IMPROVED,
            idempotencyKey: `project-improved:${version.id}`,
            projectId: updated.id,
            projectVersionId: version.id,
          });
        }
        if (appreciations.length) {
          await recordReputationEvent(tx, {
            userId: publication.authorId,
            type: ReputationEventType.PROJECT_VERSION_WITH_COMMUNITY_CREDIT,
            idempotencyKey: `project-community-credit:${version.id}`,
            projectId: updated.id,
            projectVersionId: version.id,
          });
        }
        return updated;
      });
      return ProjectMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof GenericHttpError) throw error;
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
      ...(query.seekingFeedback !== undefined && {
        seekingFeedback: query.seekingFeedback,
      }),
      ...(query.q && {
        OR: [
          { name: { contains: query.q, mode: "insensitive" } },
          { description: { contains: query.q, mode: "insensitive" } },
          { portfolio: { author: { username: { contains: query.q, mode: "insensitive" } } } },
        ],
      }),
    };

    const orderBy: Prisma.ProjectOrderByWithRelationInput | Prisma.ProjectOrderByWithRelationInput[] =
      query.sort === "likes"
        ? { likes: { _count: "desc" } }
        : query.sort === "feedback"
          ? [{ seekingFeedback: "desc" }, { publishedAt: "desc" }]
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
                  profilePhoto: true,
                  availableForHire: true,
                },
              },
            },
          },
          AppreciateProjectDetails: true,
          _count: {
            select: {
              likes: true,
              Appreciate: true,
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
          appreciates: model._count.Appreciate,
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
                profilePhoto: true,
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
        Appreciate: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: { id: true, username: true, profilePhoto: true },
            },
            versionCredits: {
              select: { projectVersion: { select: { versionNumber: true } } },
            },
          },
        },
        versions: {
          orderBy: { versionNumber: "asc" },
          include: {
            author: { select: { id: true, username: true } },
            credits: {
              include: {
                appreciation: { select: { id: true, aspect: true } },
                contributor: { select: { id: true, username: true } },
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            Appreciate: true,
            Comments: true,
            FavorateProjects: true,
          },
        },
      },
    });
    if (!model) return null;

    return {
      ...ProjectMapper.fromPrismaToContracts(model),
      author: model.portfolio.author,
      metrics: {
        likes: model._count.likes,
        appreciates: model._count.Appreciate,
        comments: model._count.Comments,
        saves: model._count.FavorateProjects,
      },
      publicFeedback: model.Feedback.map((feedback) => ({
        id: feedback.id,
        content: feedback.content,
        username: feedback.user.username,
      })),
      appreciations: model.Appreciate.map((appreciation) =>
        this.toAppreciationContract(appreciation)
      ),
      versions: model.versions.map((version) => ({
        id: version.id,
        versionNumber: version.versionNumber,
        changelog: version.changelog,
        contentMarkdown: version.contentMarkdown,
        createdAt: version.createdAt,
        author: version.author,
        credits: version.credits.map((credit) => ({
          appreciationId: credit.appreciation.id,
          aspect: credit.appreciation.aspect,
          contributor: credit.contributor,
        })),
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

  async createAppreciation(
    projectId: string,
    userId: string,
    input: CreateAppreciationInput,
  ): Promise<ProjectAppreciationContract> {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.appreciate.findUnique({
        where: { userId_projectId: { userId, projectId } },
      });
      if (existing && existing.status !== AppreciateStatus.PENDING) {
        throw new Conflict("Este Appreciate ja foi analisado pelo autor.");
      }

      const metrics = await tx.postMetrics.upsert({
        where: { projectId },
        update: {},
        create: { projectId, appreciateCount: 0 },
      });
      const appreciation = existing
        ? await tx.appreciate.update({
            where: { id: existing.id },
            data: {
              ...input,
              additionalComment: input.additionalComment || null,
              status: AppreciateStatus.PENDING,
              resolvedAt: null,
            },
            include: {
              user: { select: { id: true, username: true, profilePhoto: true } },
              versionCredits: {
                select: { projectVersion: { select: { versionNumber: true } } },
              },
            },
          })
        : await tx.appreciate.create({
            data: {
              userId,
              projectId,
              postMetricsId: metrics.id,
              ...input,
              additionalComment: input.additionalComment || null,
            },
            include: {
              user: { select: { id: true, username: true, profilePhoto: true } },
            },
          });

      if (!existing) {
        await tx.postMetrics.update({
          where: { id: metrics.id },
          data: { appreciateCount: { increment: 1 } },
        });
      }
      return this.toAppreciationContract(appreciation);
    });
  }

  async updateAppreciationStatus(
    projectId: string,
    appreciationId: string,
    status: "PENDING" | "USEFUL" | "APPLIED" | "DISMISSED",
  ): Promise<ProjectAppreciationContract> {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.appreciate.findFirst({
        where: { id: appreciationId, projectId },
        include: {
          project: {
            select: { portfolio: { select: { authorId: true } } },
          },
          versionCredits: { select: { id: true } },
        },
      });
      if (!existing) throw new NotFound("Appreciate nao encontrado.");
      if (existing.userId === existing.project.portfolio.authorId) {
        throw new Forbidden("Uma interacao propria nao pode gerar reputacao.");
      }
      if (existing.versionCredits.length && status !== "APPLIED") {
        throw new Conflict(
          "Um Appreciate creditado em uma versao deve permanecer como aplicado.",
        );
      }

      const appreciation = await tx.appreciate.update({
        where: { id: appreciationId },
        data: {
          status: status as AppreciateStatus,
          resolvedAt: status === "PENDING" ? null : new Date(),
        },
        include: {
          user: { select: { id: true, username: true, profilePhoto: true } },
          versionCredits: {
            select: { projectVersion: { select: { versionNumber: true } } },
          },
        },
      });
      if (status === "USEFUL" || status === "APPLIED") {
        const type = status === "USEFUL"
          ? ReputationEventType.APPRECIATION_USEFUL
          : ReputationEventType.APPRECIATION_APPLIED;
        await recordReputationEvent(tx, {
          userId: existing.userId,
          type,
          idempotencyKey: `appreciation-${status.toLowerCase()}:${existing.id}`,
          projectId,
          appreciationId: existing.id,
        });
      }
      return this.toAppreciationContract(appreciation);
    });
  }

  async findAppreciations(projectId: string): Promise<ProjectAppreciationContract[]> {
    const appreciations = await prisma.appreciate.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, profilePhoto: true } },
        versionCredits: {
          select: { projectVersion: { select: { versionNumber: true } } },
        },
      },
    });
    return appreciations.map((appreciation) =>
      this.toAppreciationContract(appreciation)
    );
  }

  async getInteraction(
    projectId: string,
    userId: string
  ): Promise<ProjectInteractionContract> {
    const [liked, appreciated, saved, likes, appreciates] = await Promise.all([
      prisma.like.findUnique({ where: { userId_projectId: { userId, projectId } } }),
      prisma.appreciate.findUnique({ where: { userId_projectId: { userId, projectId } } }),
      prisma.favorateProjects.findUnique({ where: { userId_projectId: { userId, projectId } } }),
      prisma.like.count({ where: { projectId } }),
      prisma.appreciate.count({ where: { projectId } }),
    ]);
    return {
      liked: Boolean(liked),
      appreciated: Boolean(appreciated),
      saved: Boolean(saved),
      likes,
      appreciates,
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

  private versionSnapshot(
    project: PrismaProject,
    versionNumber: number,
    changelog: string,
    authorId: string,
  ): Prisma.ProjectVersionUncheckedCreateInput {
    return {
      projectId: project.id,
      versionNumber,
      changelog,
      name: project.name,
      description: project.description,
      category: project.category,
      githubLink: project.githublink,
      externalLink: project.externalLink,
      coverImageUrl: project.coverImageUrl,
      galleryUrls: project.galleryUrls,
      tools: project.tools,
      tags: project.tags,
      contentBlocks: project.contentBlocks as Prisma.InputJsonValue,
      contentMarkdown: project.contentMarkdown,
      authorId,
    };
  }

  private toAppreciationContract(appreciation: {
    id: string;
    aspect: string;
    strength: string;
    improvement: string;
    additionalComment: string | null;
    status: AppreciateStatus;
    createdAt: Date;
    updatedAt: Date;
    user: { id: string; username: string; profilePhoto: string | null };
    versionCredits?: Array<{ projectVersion: { versionNumber: number } }>;
  }): ProjectAppreciationContract {
    return {
      id: appreciation.id,
      aspect: appreciation.aspect,
      strength: appreciation.strength,
      improvement: appreciation.improvement,
      additionalComment: appreciation.additionalComment,
      status: appreciation.status,
      createdAt: appreciation.createdAt,
      updatedAt: appreciation.updatedAt,
      creditedInVersion:
        appreciation.versionCredits?.[0]?.projectVersion.versionNumber ?? null,
      author: appreciation.user,
    };
  }

  private hasSnapshotChanges(
    project: PrismaProject,
    version: {
      name: string;
      description: string;
      category: PrismaProject["category"];
      githubLink: string | null;
      externalLink: string | null;
      coverImageUrl: string | null;
      galleryUrls: string[];
      tools: string[];
      tags: string[];
      contentMarkdown: string;
    },
  ): boolean {
    return project.name !== version.name
      || project.description !== version.description
      || project.category !== version.category
      || project.githublink !== version.githubLink
      || project.externalLink !== version.externalLink
      || project.coverImageUrl !== version.coverImageUrl
      || project.contentMarkdown !== version.contentMarkdown
      || JSON.stringify(project.galleryUrls) !== JSON.stringify(version.galleryUrls)
      || JSON.stringify(project.tools) !== JSON.stringify(version.tools)
      || JSON.stringify(project.tags) !== JSON.stringify(version.tags);
  }
}
