import { Project } from "@project/domain/entities/Project";
import { CreateProjectDTO, ProjectListQuery, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { PostmarkStatus, PaginatedProjectsContract, ProjectPostmarkContract, ProjectContactContract, ProjectContract, ProjectFeedbackContract, ProjectInteractionContract } from "@shared/contracts/ProjectContracts";
import { CreatePostmarkInput } from "@project/domain/interfaces/IProjectRepository";

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
  createPostmark(
    id: string,
    userId: string,
    input: CreatePostmarkInput,
  ): Promise<ProjectPostmarkContract>;
  updatePostmarkStatus(
    projectId: string,
    postmarkId: string,
    userId: string,
    status: PostmarkStatus,
  ): Promise<ProjectPostmarkContract>;
  findPostmarks(projectId: string): Promise<ProjectPostmarkContract[]>;
  getInteraction(id: string, userId: string): Promise<ProjectInteractionContract>;
  findPrivateFeedback(id: string, userId: string): Promise<ProjectFeedbackContract[]>;
}
