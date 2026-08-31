import { Project } from "@project/domain/entities/Project";
import { BadRequest, Forbidden, NotFound, TooManyRequests } from "@shared/error/HttpError";
import { CreateProjectDTO, ProjectListQuery, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { ProjectMapper } from "@project/application/ProjectMapper";
import { IProjectService } from "@project/domain/interfaces/IProjectService";
import { IProjectRepository } from "@project/domain/interfaces/IProjectRepository";
import { IPortfolioPort } from "@portfolio/domain/interfaces/PortfolioPort";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import { ProjectStatus } from "@project/domain/valueObject/ProjectContent";
import { AppreciateStatus } from "@shared/contracts/ProjectContracts";
import { CreateAppreciationInput } from "@project/domain/interfaces/IProjectRepository";

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
      createProjectDto.status === ProjectStatus.PUBLISHED &&
      latestProject &&
      Date.now() - (latestProject.getPublishedAt() ?? latestProject.getCreatedAt()).getTime() < 60_000
    ) {
      throw new TooManyRequests(
        "Aguarde um minuto antes de publicar outro projeto."
      );
    }

    const project = ProjectMapper.fromCreateProjectDtoToDomain({
      ...createProjectDto,
      portfolioId,
    });
    if (project.getStatus() === ProjectStatus.PUBLISHED && !project.isReadyToPublish()) {
      throw new BadRequest("Adicione um titulo e pelo menos um bloco antes de publicar.");
    }
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

    const isLegacyUpdate =
      updateProjectDto.status === undefined &&
      updateProjectDto.contentBlocks === undefined &&
      project.getContentBlocks().length === 0;
    project.update(updateProjectDto);
    if (
      project.getStatus() === ProjectStatus.PUBLISHED &&
      !project.isReadyToPublish() &&
      !isLegacyUpdate
    ) {
      throw new BadRequest("Adicione um titulo e pelo menos um bloco antes de publicar.");
    }
    const publication = updateProjectDto.status === ProjectStatus.PUBLISHED
      ? {
          authorId: userId,
          changelog: updateProjectDto.changelog?.trim() || "Nova versao publicada",
          appreciationIds: [...new Set(updateProjectDto.appreciationIds ?? [])],
        }
      : undefined;
    return await this.repository.update(project, publication);
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

  async findMine(userId: string) {
    return await this.repository.findByOwner(userId);
  }

  async findForEditor(id: string, userId: string) {
    const project = await this.repository.findById(id);
    if (!project) throw new NotFound("O projeto nao existe");
    if (!(await this.portfolioPort.isOwnedBy(project.getPortfolioId(), userId))) {
      throw new Forbidden("Voce so pode editar os proprios projetos.");
    }
    return ProjectMapper.fromDomainToContract(project);
  }

  async findOwnerContact(id: string) {
    const contact = await this.repository.findOwnerContact(id);
    if (!contact) {
      throw new NotFound("O autor nao esta disponivel para contratacao.");
    }
    return contact;
  }

  async setLike(id: string, userId: string, liked: boolean) {
    const project = await this.repository.findById(id);
    if (!project || project.getStatus() !== ProjectStatus.PUBLISHED) {
      throw new NotFound("O projeto nao existe");
    }
    return await this.repository.setLike(id, userId, liked);
  }

  async createAppreciation(
    id: string,
    userId: string,
    input: CreateAppreciationInput,
  ) {
    const project = await this.repository.findById(id);
    if (!project || project.getStatus() !== ProjectStatus.PUBLISHED) {
      throw new NotFound("O projeto nao existe");
    }
    if (await this.portfolioPort.isOwnedBy(project.getPortfolioId(), userId)) {
      throw new Forbidden("Voce nao pode enviar Appreciate para o proprio projeto.");
    }
    const requestedAspects = project.getFeedbackAspects();
    if (requestedAspects.length && !requestedAspects.includes(input.aspect)) {
      throw new BadRequest("Escolha um dos aspectos de feedback pedidos pelo autor.");
    }
    return await this.repository.createAppreciation(id, userId, input);
  }

  async updateAppreciationStatus(
    projectId: string,
    appreciationId: string,
    userId: string,
    status: AppreciateStatus,
  ) {
    if (!(await this.repository.isOwnedBy(projectId, userId))) {
      throw new Forbidden("Apenas o autor pode classificar este Appreciate.");
    }
    return await this.repository.updateAppreciationStatus(
      projectId,
      appreciationId,
      status,
    );
  }

  async findAppreciations(projectId: string) {
    const project = await this.repository.findById(projectId);
    if (!project || project.getStatus() !== ProjectStatus.PUBLISHED) {
      throw new NotFound("O projeto nao existe");
    }
    return await this.repository.findAppreciations(projectId);
  }

  async getInteraction(id: string, userId: string) {
    const project = await this.repository.findById(id);
    if (!project || project.getStatus() !== ProjectStatus.PUBLISHED) {
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
