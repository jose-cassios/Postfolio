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
