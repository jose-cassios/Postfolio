import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { Project } from "@project/domain/entities/Project";
import { ProjectListQuery } from "@project/api/ProjectDTO";
import { PaginatedProjectsContract, ProjectContactContract, ProjectFeedbackContract, ProjectInteractionContract } from "@shared/contracts/ProjectContracts";

export interface IProjectRepository {
  create(work: Project): Promise<Project>;
  update(work: Project): Promise<Project>;
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
  setAppreciation(
    projectId: string,
    userId: string,
    appreciated: boolean,
    feedback?: { content: string; type: "PUBLIC" | "PRIVATE" }
  ): Promise<ProjectInteractionContract>;
  getInteraction(projectId: string, userId: string): Promise<ProjectInteractionContract>;
  isOwnedBy(projectId: string, userId: string): Promise<boolean>;
  findPrivateFeedback(projectId: string): Promise<ProjectFeedbackContract[]>;
}
