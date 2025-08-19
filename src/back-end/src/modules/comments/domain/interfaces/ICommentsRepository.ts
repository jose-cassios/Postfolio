import { Comments } from "@comments/domain/entities/Comments";

export interface ICommentsRepository {
  create(comment: Comments): Promise<Comments>;
  update(comment: Comments): Promise<Comments>;
  delete(comment: Comments): Promise<Comments>;

  findById(id: string): Promise<Comments | null>;
  findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<Comments | null>;
}
