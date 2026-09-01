import {
  Prisma,
  ProjectCategory as ProjectCategoryModel,
  Project as ProjectModel,
  ProjectStatus as ProjectStatusModel,
} from "@PrismaGen/client";
import { Project } from "@project/domain/entities/Project";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { ProjectCategory } from "@project/domain/enum/ProjectCategory";
import {
  parseProjectBlocks,
  ProjectStatus,
  projectBlocksToMarkdown,
  projectBlocksToSummary,
} from "@project/domain/valueObject/ProjectContent";

export const ProjectCategoryMapper = {
  fromPrismaToDomain(prismaCategory: ProjectCategoryModel): ProjectCategory {
    switch (prismaCategory) {
      case ProjectCategoryModel.FULLSTACK:
        return ProjectCategory.FULLSTACK;
      case ProjectCategoryModel.FRONTEND:
        return ProjectCategory.FRONTEND;
      case ProjectCategoryModel.BACKEND:
        return ProjectCategory.BACKEND;
      case ProjectCategoryModel.DESIGN:
        return ProjectCategory.DESIGN;
      case ProjectCategoryModel.MOBILE:
        return ProjectCategory.MOBILE;
      case ProjectCategoryModel.DATA_ANALYSIS:
        return ProjectCategory.DATA_ANALYSIS;
      case ProjectCategoryModel.OTHER:
        return ProjectCategory.OTHER;
      default:
        throw new Error(
          `Categoria de projeto inválida do Prisma: ${prismaCategory}`
        );
    }
  },
  fromDomainToPrisma(domainCategory: ProjectCategory): ProjectCategoryModel {
    switch (domainCategory) {
      case ProjectCategory.FULLSTACK:
        return ProjectCategoryModel.FULLSTACK;
      case ProjectCategory.FRONTEND:
        return ProjectCategoryModel.FRONTEND;
      case ProjectCategory.BACKEND:
        return ProjectCategoryModel.BACKEND;
      case ProjectCategory.DESIGN:
        return ProjectCategoryModel.DESIGN;
      case ProjectCategory.MOBILE:
        return ProjectCategoryModel.MOBILE;
      case ProjectCategory.DATA_ANALYSIS:
        return ProjectCategoryModel.DATA_ANALYSIS;
      case ProjectCategory.OTHER:
        return ProjectCategoryModel.OTHER;
      default:
        throw new Error(
          `Categoria de projeto inválida do domínio: ${domainCategory}`
        );
    }
  },
  fromSchemaToDomain(category: string): ProjectCategory {
    const uppercaseCategory = category.toUpperCase();

    if (
      Object.values(ProjectCategory).includes(
        uppercaseCategory as ProjectCategory
      )
    ) {
      return uppercaseCategory as ProjectCategory;
    }

    throw new Error(
      `A string "${category}" não é uma categoria de projeto válida.`
    );
  },
};

export const ProjectMapper = {
  fromPrismaToDomain(projectModel: ProjectModel): Project {
    return new Project(
      projectModel.id,
      projectModel.name,
      projectModel.description,
      ProjectCategoryMapper.fromPrismaToDomain(projectModel.category),
      projectModel.portfolioId,
      projectModel.githublink,
      projectModel.externalLink,
      projectModel.coverImageUrl,
      projectModel.galleryUrls,
      projectModel.tools,
      projectModel.tags,
      parseProjectBlocks(projectModel.contentBlocks),
      projectModel.contentMarkdown,
      projectModel.status as ProjectStatus,
      projectModel.feedbackAspects,
      projectModel.feedbackQuestion,
      projectModel.seekingFeedback,
      projectModel.currentVersion,
      projectModel.publishedAt,
      projectModel.createdAt,
      projectModel.updatedAt
    );
  },
  fromPrismaToContracts(projectModel: ProjectModel): ProjectContract {
    return {
      id: projectModel.id,
      name: projectModel.name,
      description: projectModel.description,
      category: ProjectCategoryMapper.fromPrismaToDomain(projectModel.category),
      githubLink: projectModel.githublink,
      externalLink: projectModel.externalLink,
      coverImageUrl: projectModel.coverImageUrl,
      galleryUrls: projectModel.galleryUrls,
      tools: projectModel.tools,
      tags: projectModel.tags,
      contentBlocks: parseProjectBlocks(projectModel.contentBlocks),
      contentMarkdown: projectModel.contentMarkdown,
      status: projectModel.status as ProjectStatus,
      feedbackAspects: projectModel.feedbackAspects,
      feedbackQuestion: projectModel.feedbackQuestion,
      currentVersion: projectModel.currentVersion,
      publishedAt: projectModel.publishedAt,
      createdAt: projectModel.createdAt,
      updatedAt: projectModel.updatedAt,
      portfolioId: projectModel.portfolioId,
    };
  },
  fromDomainToPrisma(project: Project): ProjectModel {
    return {
      id: project.getId(),
      name: project.getName(),
      description: project.getDescription(),
      category: ProjectCategoryMapper.fromDomainToPrisma(project.getCategory()),
      githublink: project.getGithubLink(),
      externalLink: project.getExternalLink(),
      coverImageUrl: project.getCoverImageUrl(),
      galleryUrls: project.getGalleryUrls(),
      tools: project.getTools(),
      tags: project.getTags(),
      contentBlocks: project.getContentBlocks() as unknown as Prisma.JsonValue,
      contentMarkdown: project.getContentMarkdown(),
      status: project.getStatus() as ProjectStatusModel,
      feedbackAspects: project.getFeedbackAspects(),
      feedbackQuestion: project.getFeedbackQuestion(),
      seekingFeedback: project.isSeekingFeedback(),
      currentVersion: project.getCurrentVersion(),
      publishedAt: project.getPublishedAt(),
      createdAt: project.getCreatedAt(),
      updatedAt: project.getUpdatedAt(),
      portfolioId: project.getPortfolioId(),
    };
  },
  fromCreateProjectDtoToDomain(dto: CreateProjectDTO): Project {
    const contentBlocks = dto.contentBlocks ?? [];
    const status = dto.status ?? ProjectStatus.DRAFT;
    const description = dto.description?.trim() || projectBlocksToSummary(contentBlocks);
    return new Project(
      "",
      dto.name,
      description,
      dto.category,
      dto.portfolioId,
      dto.githublink,
      dto.externalLink,
      dto.coverImageUrl,
      dto.galleryUrls,
      dto.tools,
      dto.tags,
      contentBlocks,
      projectBlocksToMarkdown(contentBlocks),
      status,
      dto.feedbackAspects ?? [],
      dto.feedbackQuestion ?? null,
      true,
      0,
      status === ProjectStatus.PUBLISHED ? new Date() : null,
    );
  },
  fromDomainToContract(project: Project): ProjectContract {
    return {
      id: project.getId(),
      name: project.getName(),
      description: project.getDescription(),
      category: project.getCategory(),
      githubLink: project.getGithubLink(),
      externalLink: project.getExternalLink(),
      coverImageUrl: project.getCoverImageUrl(),
      galleryUrls: project.getGalleryUrls(),
      tools: project.getTools(),
      tags: project.getTags(),
      contentBlocks: project.getContentBlocks(),
      contentMarkdown: project.getContentMarkdown(),
      status: project.getStatus(),
      feedbackAspects: project.getFeedbackAspects(),
      feedbackQuestion: project.getFeedbackQuestion(),
      currentVersion: project.getCurrentVersion(),
      publishedAt: project.getPublishedAt(),
      createdAt: project.getCreatedAt(),
      updatedAt: project.getUpdatedAt(),
      portfolioId: project.getPortfolioId(),
    };
  },
  // fromUpdateProjectDtoToDomain(dto: UpdateProjectDTO): Project {
  //   return new Project(
  //     dto.id,
  //     dto.name,
  //     dto.description,
  //     dto.category,
  //     dto.portfolio,
  //     dto.githublink
  //   );
  // },
};
