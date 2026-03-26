import {
  ProjectCategory as ProjectCategoryModel,
  Project as ProjectModel,
} from "@PrismaGen/client";
import { Project } from "@project/domain/entities/Project";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { ProjectCategory } from "@project/domain/enum/ProjectCategory";

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
      projectModel.githublink
    );
  },
  fromPrismaToContracts(projectModel: ProjectModel): ProjectContract {
    return {
      id: projectModel.id,
      name: projectModel.name,
      description: projectModel.description,
      category: ProjectCategoryMapper.fromPrismaToDomain(projectModel.category),
      githubLink: projectModel.githublink,
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
      portfolioId: project.getPortfolioId(),
    };
  },
  fromCreateProjectDtoToDomain(dto: CreateProjectDTO): Project {
    return new Project(
      "",
      dto.name,
      dto.description,
      dto.category,
      dto.portfolioId,
      dto.githublink
    );
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
