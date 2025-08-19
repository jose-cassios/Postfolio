import {
  CreateCommentDTO,
  UpdateCommentDTO,
  DeleteCommentDTO,
} from "@comments/api/CommentsDTO";
import { Comments } from "@comments/domain/entities/Comments";
import { ICommentsRepository } from "@comments/domain/interfaces/ICommentsRepository";
import { ICommentsService } from "@comments/domain/interfaces/ICommentsService";
import { TYPES } from "@compositionRoot/Types";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { Forbidden, NotFound } from "@shared/error/HttpError";
import { inject, injectable } from "inversify";

@injectable()
export class CommentsService implements ICommentsService {
  constructor(
    @inject(TYPES.ICommentsRepository)
    private repository: ICommentsRepository,
    @inject(TYPES.ProjectPort)
    private projectPort: ProjectPort
  ) {}

  async create(dto: CreateCommentDTO): Promise<Comments> {
    const exist = await this.projectPort.exist(dto.projectId);

    if (!exist) throw new NotFound("O projecto a ser comentado não existe!");

    const comment = Comments.create(dto);

    return await this.repository.create(comment);
  }

  async update(dto: UpdateCommentDTO): Promise<Comments> {
    const comment = await this.repository.findById(dto.id);

    if (!comment) throw new NotFound("O comentado não existe!");

    comment.update(dto);

    return await this.repository.update(comment);
  }

  async delete(dto: DeleteCommentDTO): Promise<Comments> {
    const comment = await this.repository.findById(dto.id);

    if (!comment) throw new NotFound("O comentado não existe!");
    if (dto.userId !== comment.getUserId())
      throw new Forbidden("O comentario pertence a outro usuario!");

    return await this.repository.delete(comment);
  }
}
