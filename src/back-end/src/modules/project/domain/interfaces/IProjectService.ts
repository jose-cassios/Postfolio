import { Project } from "@project/domain/entities/Project";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";

export interface IProjectService {
  create(createWorkDto: Omit<CreateProjectDTO, "portfolioId">, userId: string): Promise<Project>;
  update(updateWorkDto: UpdateProjectDTO, userId: string): Promise<Project>;
  delete(id: string, userId: string): Promise<Project | null>;

  findMany(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
}
