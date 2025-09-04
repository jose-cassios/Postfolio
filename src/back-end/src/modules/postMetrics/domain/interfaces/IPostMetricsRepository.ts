import { PostMetrics } from "@postMetrics/domain/entities/PostMetrics";

export interface IPostMetricsRepository {
  create(postMetrcis: PostMetrics): Promise<PostMetrics>;
  update(postMetrcis: PostMetrics): Promise<PostMetrics>;
  delete(postMetrcis: PostMetrics): Promise<PostMetrics>;

  findById(id: string): Promise<PostMetrics | null>;
  findByProjectId(projectId: string): Promise<PostMetrics | null>;
}
