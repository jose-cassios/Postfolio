import { Comments } from "@comments/domain/entities/Comments";

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

export interface ResponsePagination<T> {
  data: T[];
  pagination: {
    next_cursor: string | null;
    has_next_page: boolean;
  };
}

export type ResponseCommentsPagination = ResponsePagination<Comments>;
