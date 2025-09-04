import {
  CreateCommentDTO,
  DeleteCommentDTO,
  GetCommentsDTO,
  PaginatedCommentsResponse,
  UpdateCommentDTO,
} from "@comments/api/CommentsDTO";
import { Comments } from "@comments/domain/entities/Comments";

export interface ICommentsService {
  create(dto: CreateCommentDTO): Promise<Comments>;
  update(dto: UpdateCommentDTO): Promise<Comments>;
  delete(dto: DeleteCommentDTO): Promise<Comments>;

  getComments(dto: GetCommentsDTO): Promise<PaginatedCommentsResponse>;
}
