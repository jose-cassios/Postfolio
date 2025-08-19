import { Comments } from "@comments/domain/entities/Comments";

export interface ICommentsService {
  create(comment: Comments): Promise<Comments>;
  update(comment: Comments): Promise<Comments>;
  delete(comment: Comments): Promise<Comments>;

  findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<Comments | null>;
}
