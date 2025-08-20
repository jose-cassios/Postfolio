import { Comments } from "@comments/domain/entities/Comments";

export interface ICommentsRepository {
  create(comment: Comments): Promise<Comments>;
  update(comment: Comments): Promise<Comments>;
  delete(comment: Comments): Promise<Comments>;

  findById(id: string): Promise<Comments | null>;
  findProjectIdCursor(
    projectId: string,
    limit: number,
    date: Date | null
  ): Promise<Comments[]>;
}
