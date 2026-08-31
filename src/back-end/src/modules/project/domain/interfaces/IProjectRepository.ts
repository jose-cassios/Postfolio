import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { Project } from "@project/domain/entities/Project";
import { ProjectListQuery } from "@project/api/ProjectDTO";
import { AppreciateStatus, PaginatedProjectsContract, ProjectAppreciationContract, ProjectContactContract, ProjectFeedbackContract, ProjectInteractionContract } from "@shared/contracts/ProjectContracts";

export interface VersionPublication {
  authorId: string;
  changelog: string;
  appreciationIds: string[];
}

export interface CreateAppreciationInput {
  aspect: string;
  strength: string;
  improvement: string;
  additionalComment?: string | null;
}

export interface IProjectRepository {
  create(work: Project): Promise<Project>;
  update(work: Project, publication?: VersionPublication): Promise<Project>;
  delete(id: string): Promise<Project | null>;

  findMany(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByPortfolio(portfolioId: string): Promise<ProjectContract[]>;
  findByOwner(userId: string): Promise<ProjectContract[]>;
  findPublicMany(query: ProjectListQuery): Promise<PaginatedProjectsContract>;
  findPublicById(id: string): Promise<ProjectContract | null>;
  findOwnerContact(projectId: string): Promise<ProjectContactContract | null>;
  findLatestByPortfolio(portfolioId: string): Promise<Project | null>;
  setLike(projectId: string, userId: string, liked: boolean): Promise<ProjectInteractionContract>;
  createAppreciation(
    projectId: string,
    userId: string,
    input: CreateAppreciationInput
  ): Promise<ProjectAppreciationContract>;
  updateAppreciationStatus(
    projectId: string,
    appreciationId: string,
    status: AppreciateStatus,
  ): Promise<ProjectAppreciationContract>;
  findAppreciations(projectId: string): Promise<ProjectAppreciationContract[]>;
  getInteraction(projectId: string, userId: string): Promise<ProjectInteractionContract>;
  isOwnedBy(projectId: string, userId: string): Promise<boolean>;
  findPrivateFeedback(projectId: string): Promise<ProjectFeedbackContract[]>;
}
