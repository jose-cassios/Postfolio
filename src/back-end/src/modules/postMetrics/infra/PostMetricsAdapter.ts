import { TYPES } from "@compositionRoot/Types";
import { PostMetrics } from "@postMetrics/domain/entities/PostMetrics";
import { IPostMetricsRepository } from "@postMetrics/domain/interfaces/IPostMetricsRepository";
import { PostMetricsPort } from "@postMetrics/domain/interfaces/PostMetricsPort";
import { NotFound } from "@shared/error/HttpError";
import { inject, injectable } from "inversify";

@injectable()
export class PostMetricsAdapter implements PostMetricsPort {
  constructor(
    @inject(TYPES.IPostMetricsRepository)
    private repository: IPostMetricsRepository
  ) {}

  async addAppreciate(projectId: string): Promise<string> {
    let postMetrics = await this.repository.findByProjectId(projectId);

    if (!postMetrics) {
      postMetrics = await this.createDefaultMetrics(projectId);
    }

    postMetrics.incrementsAppreciateCount();
    await this.repository.update(postMetrics);

    return postMetrics.getId();
  }

  private async createDefaultMetrics(projectId: string): Promise<PostMetrics> {
    const metrics = PostMetrics.create({ projectId, verifiedData: true });
    return await this.repository.create(metrics);
  }

  async removeAppreciate(projectId: string): Promise<string> {
    const metrics = await this.repository.findByProjectId(projectId);

    if (!metrics) throw new NotFound("Recurro não encontrado!");

    metrics.decrementAppreciateCount();
    await this.repository.update(metrics);
    return metrics.getId();
  }
}
