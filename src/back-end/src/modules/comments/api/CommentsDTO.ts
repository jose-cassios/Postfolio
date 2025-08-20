import { Comments } from "@comments/domain/entities/Comments";
import { PaginatedResponse } from "@shared/interfaces/Pagination";

export interface CreateCommentDTO {
  content: string;
  userId: string;
  projectId: string;
}

export interface UpdateCommentDTO {
  id: string;
  content: string;
  userId: string;
}

export interface DeleteCommentDTO {
  id: string;
  userId: string;
}

export interface GetCommentsDTO {
  postId: string;
  cursor?: string | null;
}

export type PaginatedCommentsResponse = PaginatedResponse<Comments>;
