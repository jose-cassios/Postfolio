import { IProjectService } from "@project/domain/interfaces/IProjectService";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListRequest,
  SetLikeRequest,
  CreateAppreciationRequest,
  UpdateAppreciationStatusRequest,
} from "@project/api/ProjectSchema";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { BadRequest } from "@shared/error/HttpError";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import { ProjectCategoryMapper, ProjectMapper } from "@project/application/ProjectMapper";
import { ProjectStatus } from "@project/domain/valueObject/ProjectContent";

@injectable()
export class WorkController {
  constructor(
    @inject(TYPES.IProjectService)
    private workService: IProjectService
  ) {}

  async create(req: CreateProjectRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");

    const dto: Omit<CreateProjectDTO, "portfolioId"> = {
      ...req.body,
      category: ProjectCategoryMapper.fromSchemaToDomain(req.body.category),
      status: req.body.status
        ? ProjectStatus[req.body.status]
        : ProjectStatus.PUBLISHED,
    };
    const project = await this.workService.create(dto, userId);
    reply.code(201).send(ProjectMapper.fromDomainToContract(project));
  }

  async update(req: UpdateProjectRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");

    const dto: UpdateProjectDTO = {
      ...req.body,
      id: req.params.projectId,
      category: req.body.category
        ? ProjectCategoryMapper.fromSchemaToDomain(req.body.category)
        : undefined,
      status: req.body.status ? ProjectStatus[req.body.status] : undefined,
    };
    const project = await this.workService.update(dto, userId);
    reply.send(ProjectMapper.fromDomainToContract(project));
  }

  async getMine(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");
    reply.send(await this.workService.findMine(userId));
  }

  async getForEditor(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    const { projectId } = req.params as { projectId?: string };
    if (!userId || !projectId) {
      throw new BadRequest("Usuario e projeto sao obrigatorios");
    }
    reply.send(await this.workService.findForEditor(projectId, userId));
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    const { projectId } = req.params as { projectId?: string };
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");
    if (!projectId) throw new BadRequest("ID do projeto e necessario");

    reply.send(await this.workService.delete(projectId, userId));
  }

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    reply.send(await this.workService.findMany());
  }

  async getById(req: FastifyRequest, reply: FastifyReply) {
    const { projectId } = req.params as { projectId?: string };
    if (!projectId) throw new BadRequest("ID do projeto e necessario");

    reply.send(await this.workService.findPublicById(projectId));
  }

  async list(req: ProjectListRequest, reply: FastifyReply) {
    const query = {
      ...req.query,
      category: req.query.category
        ? ProjectCategoryMapper.fromSchemaToDomain(req.query.category)
        : undefined,
    };
    reply.send(await this.workService.findPublicMany(query));
  }

  async getContact(req: FastifyRequest, reply: FastifyReply) {
    const { projectId } = req.params as { projectId?: string };
    if (!projectId) throw new BadRequest("ID do projeto e necessario");
    reply.send(await this.workService.findOwnerContact(projectId));
  }

  async setLike(req: SetLikeRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");
    reply.send(
      await this.workService.setLike(req.params.projectId, userId, req.body.liked)
    );
  }

  async createAppreciation(req: CreateAppreciationRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");
    reply.code(201).send(
      await this.workService.createAppreciation(
        req.params.projectId,
        userId,
        req.body,
      )
    );
  }

  async updateAppreciationStatus(
    req: UpdateAppreciationStatusRequest,
    reply: FastifyReply,
  ) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");
    reply.send(await this.workService.updateAppreciationStatus(
      req.params.projectId,
      req.params.appreciationId,
      userId,
      req.body.status,
    ));
  }

  async getAppreciations(req: FastifyRequest, reply: FastifyReply) {
    const { projectId } = req.params as { projectId?: string };
    if (!projectId) throw new BadRequest("ID do projeto e necessario");
    reply.send(await this.workService.findAppreciations(projectId));
  }

  async getInteraction(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    const { projectId } = req.params as { projectId?: string };
    if (!userId || !projectId) {
      throw new BadRequest("Usuario e projeto sao obrigatorios");
    }
    reply.send(await this.workService.getInteraction(projectId, userId));
  }

  async getPrivateFeedback(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    const { projectId } = req.params as { projectId?: string };
    if (!userId || !projectId) {
      throw new BadRequest("Usuario e projeto sao obrigatorios");
    }
    reply.send(await this.workService.findPrivateFeedback(projectId, userId));
  }
}
