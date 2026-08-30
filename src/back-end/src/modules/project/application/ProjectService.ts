import { Project } from "@project/domain/entities/Project";
import { Forbidden, NotFound, TooManyRequests } from "@shared/error/HttpError";
import { CreateProjectDTO, ProjectListQuery, UpdateProjectDTO } from "@project/api/ProjectDTO";
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

    const latestProject = await this.repository.findLatestByPortfolio(portfolioId);
    if (
      latestProject &&
      Date.now() - latestProject.getCreatedAt().getTime() < 60_000
    ) {
      throw new TooManyRequests(
        "Aguarde um minuto antes de publicar outro projeto."
      );
    }

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

  async findPublicMany(query: ProjectListQuery) {
    return await this.repository.findPublicMany(query);
  }

  async findPublicById(id: string) {
    const project = await this.repository.findPublicById(id);
    if (!project) throw new NotFound("O projeto nao existe");
    return project;
  }

  async findOwnerContact(id: string) {
    const contact = await this.repository.findOwnerContact(id);
    if (!contact) {
      throw new NotFound("O autor nao esta disponivel para contratacao.");
    }
    return contact;
  }

  async setLike(id: string, userId: string, liked: boolean) {
    if (!(await this.repository.findById(id))) {
      throw new NotFound("O projeto nao existe");
    }
    return await this.repository.setLike(id, userId, liked);
  }

  async setAppreciation(
    id: string,
    userId: string,
    appreciated: boolean,
    feedback?: { content: string; type: "PUBLIC" | "PRIVATE" }
  ) {
    if (!(await this.repository.findById(id))) {
      throw new NotFound("O projeto nao existe");
    }
    return await this.repository.setAppreciation(
      id,
      userId,
      appreciated,
      feedback
    );
  }

  async getInteraction(id: string, userId: string) {
    if (!(await this.repository.findById(id))) {
      throw new NotFound("O projeto nao existe");
    }
    return await this.repository.getInteraction(id, userId);
  }

  async findPrivateFeedback(id: string, userId: string) {
    if (!(await this.repository.isOwnedBy(id, userId))) {
      throw new Forbidden("Apenas o autor pode consultar feedbacks privados.");
    }
    return await this.repository.findPrivateFeedback(id);
  }
}
