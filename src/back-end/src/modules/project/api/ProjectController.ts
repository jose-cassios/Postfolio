import { IProjectService } from "@project/domain/interfaces/IProjectService";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectListRequest,
  SetLikeRequest,
  SetAppreciationRequest,
} from "@project/api/ProjectSchema";
import { CreateProjectDTO, UpdateProjectDTO } from "@project/api/ProjectDTO";
import { BadRequest } from "@shared/error/HttpError";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import { ProjectCategoryMapper } from "@project/application/ProjectMapper";

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
    };
    reply.code(201).send(await this.workService.create(dto, userId));
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
    };
    reply.send(await this.workService.update(dto, userId));
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

  async setAppreciation(req: SetAppreciationRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new BadRequest("Usuario autenticado e obrigatorio");
    reply.send(
      await this.workService.setAppreciation(
        req.params.projectId,
        userId,
        req.body.appreciated,
        req.body.feedback
      )
    );
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
