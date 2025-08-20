import {
  CreateCommentDTO,
  UpdateCommentDTO,
  DeleteCommentDTO,
  GetCommentsDTO,
  PaginatedCommentsResponse,
} from "@comments/api/CommentsDTO";
import { Comments } from "@comments/domain/entities/Comments";
import { ICommentsRepository } from "@comments/domain/interfaces/ICommentsRepository";
import { ICommentsService } from "@comments/domain/interfaces/ICommentsService";
import { TYPES } from "@compositionRoot/Types";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { BadRequest, Forbidden, NotFound } from "@shared/error/HttpError";
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

  async getComments(dto: GetCommentsDTO): Promise<PaginatedCommentsResponse> {
    const PAGE_SIZE = 2;
    let comments: Comments[];
    let nextCursor: string | null = null;

    const cursor = this.getCursor(dto);

    comments = await this.repository.findProjectIdCursor(
      dto.postId,
      PAGE_SIZE + 1,
      cursor
    );

    const hasNextPage = comments.length > PAGE_SIZE ? true : false;

    if (hasNextPage) {
      comments.pop();

      const lastComment = comments[comments.length - 1];
      nextCursor = `${lastComment
        .getCreatedAt()
        .toISOString()}_${lastComment.getId()}`;
    }

    return {
      data: comments,
      pagination: {
        next_cursor: nextCursor,
        has_next_page: hasNextPage,
      },
    };
  }

  private getCursor(dto: GetCommentsDTO): Date | null {
    if (!dto.cursor) return null;

    const parts = dto.cursor.split("_");

    if (parts.length !== 2) throw new BadRequest("Dados do cursor incorretos!");

    const timestamp = new Date(parts[0]);

    if (isNaN(timestamp.getTime())) {
      throw new BadRequest("O timestamp do cursor é inválido.");
    }

    return new Date(parts[0]);
  }
}
