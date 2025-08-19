import { CreateCommentDTO, UpdateCommentDTO } from "@comments/api/CommentsDTO";
import { Forbidden } from "@shared/error/HttpError";

export class Comments {
  constructor(
    private id: string,
    private content: string,
    private userId: string,
    private projectId: string,
    private createdAt: Date
  ) {}

  static create(dto: CreateCommentDTO): Comments {
    return new Comments("", dto.content, dto.userId, dto.projectId, new Date());
  }

  public update(dto: UpdateCommentDTO) {
    if (dto.userId !== this.userId)
      throw new Forbidden("O comentario pertence a outro usuario!");
    this.content = dto.content;
  }

  public getId(): string {
    return this.id;
  }

  public getContent(): string {
    return this.content;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getProjectId(): string {
    return this.projectId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
