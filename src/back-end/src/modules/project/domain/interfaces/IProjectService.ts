import { Project } from "@project/domain/entities/Project";
import { CreateProjectDTO, ProjectListQuery, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { PaginatedProjectsContract, ProjectContactContract, ProjectContract, ProjectFeedbackContract, ProjectInteractionContract } from "@shared/contracts/ProjectContracts";

export interface IProjectService {
  create(createWorkDto: Omit<CreateProjectDTO, "portfolioId">, userId: string): Promise<Project>;
  update(updateWorkDto: UpdateProjectDTO, userId: string): Promise<Project>;
  delete(id: string, userId: string): Promise<Project | null>;

  findMany(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findPublicMany(query: ProjectListQuery): Promise<PaginatedProjectsContract>;
  findPublicById(id: string): Promise<ProjectContract | null>;
  findMine(userId: string): Promise<ProjectContract[]>;
  findForEditor(id: string, userId: string): Promise<ProjectContract>;
  findOwnerContact(id: string): Promise<ProjectContactContract>;
  setLike(id: string, userId: string, liked: boolean): Promise<ProjectInteractionContract>;
  setAppreciation(
    id: string,
    userId: string,
    appreciated: boolean,
    feedback?: { content: string; type: "PUBLIC" | "PRIVATE" }
  ): Promise<ProjectInteractionContract>;
  getInteraction(id: string, userId: string): Promise<ProjectInteractionContract>;
  findPrivateFeedback(id: string, userId: string): Promise<ProjectFeedbackContract[]>;
}
