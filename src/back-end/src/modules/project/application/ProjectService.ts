import { Project } from "@project/domain/entities/Project";
import { Forbidden, NotFound } from "@shared/error/HttpError";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { ProjectMapper } from "@project/application/ProjectMapper";
import { IProjectService } from "@project/domain/interfaces/IProjectService";
import { IProjectRepository } from "@project/domain/interfaces/IProjectRepository";
import { IPortfolioPort } from "@portfolio/domain/interfaces/PortfolioPort";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";

@injectable()
export class ProjectService implements IProjectService {
  constructor(
    @inject(TYPES.IProjectRepository)
    private repository: IProjectRepository,
    @inject(TYPES.PortfolioPort)
    private portfolioPort: IPortfolioPort
  ) {}

  async create(
    createProjectDto: Omit<CreateProjectDTO, "portfolioId">,
    userId: string
  ): Promise<Project> {
    const portfolioId = await this.portfolioPort.getOrCreateIdByAuthor(userId);

    const project = ProjectMapper.fromCreateProjectDtoToDomain({
      ...createProjectDto,
      portfolioId,
    });
    return await this.repository.create(project);
  }

  async update(
    updateProjectDto: UpdateProjectDTO,
    userId: string
  ): Promise<Project> {
    const project = await this.repository.findById(updateProjectDto.id);
    if (!project) throw new NotFound("O projeto nao existe");

    if (!(await this.portfolioPort.isOwnedBy(project.getPortfolioId(), userId))) {
      throw new Forbidden("Voce so pode editar os proprios projetos.");
    }

    project.update(updateProjectDto);
    return await this.repository.update(project);
  }

  async delete(id: string, userId: string): Promise<Project | null> {
    const project = await this.repository.findById(id);
    if (!project) throw new NotFound("O projeto nao existe");

    if (!(await this.portfolioPort.isOwnedBy(project.getPortfolioId(), userId))) {
      throw new Forbidden("Voce so pode remover os proprios projetos.");
    }

    return await this.repository.delete(id);
  }

  async findMany(): Promise<Project[]> {
    return await this.repository.findMany();
  }

  async findById(id: string): Promise<Project | null> {
    return await this.repository.findById(id);
  }
}
