import { Project } from "@project/domain/entities/Project";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";

export interface IProjectService {
  create(createWorkDto: CreateProjectDTO): Promise<Project>;
  update(updateWorkDto: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<Project | null>;

  findMany(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
}
