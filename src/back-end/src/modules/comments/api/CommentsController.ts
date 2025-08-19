import { ICommentsService } from "@comments/domain/interfaces/ICommentsService";
import { TYPES } from "@compositionRoot/Types";
import { inject, injectable } from "inversify";
import {
  CreateCommentsRequest,
  DeleteCommentsRequest,
  UpdateCommentRequest,
} from "@comments/api/CommentsSchema";
import { FastifyReply } from "fastify";
import {
  CreateCommentDTO,
  DeleteCommentDTO,
  UpdateCommentDTO,
} from "@comments/api/CommentsDTO";
import { Unauthorized } from "@shared/error/HttpError";

@injectable()
export class CommentsController {
  constructor(
    @inject(TYPES.ICommentsService)
    private service: ICommentsService
  ) {}

  async create(req: CreateCommentsRequest, reply: FastifyReply) {
    const user = req.user;

    if (!user) throw new Unauthorized("O usuario precisa estar lógado!");

    const dto: CreateCommentDTO = {
      ...req.body,
      userId: user.id,
      projectId: req.body.project,
    };

    const response = await this.service.create(dto);

    reply.status(201).send(response);
  }

  async update(req: UpdateCommentRequest, reply: FastifyReply) {
    const user = req.user;

    if (!user) throw new Unauthorized("O usuario precisa estar lógado!");

    const dto: UpdateCommentDTO = {
      ...req.body,
      id: req.params.commentId,
      userId: user.id,
    };

    const response = await this.service.update(dto);

    reply.send(response);
  }

  async delete(req: DeleteCommentsRequest, reply: FastifyReply) {
    const user = req.user;

    if (!user) throw new Unauthorized("O usuario precisa estar lógado!");

    const dto: DeleteCommentDTO = { id: req.params.commentId, userId: user.id };

    const response = await this.service.delete(dto);

    reply.send(response);
  }
}
