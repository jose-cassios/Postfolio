import { TYPES } from "@compositionRoot/Types";
import { IPostMetricsRepository } from "@postMetrics/domain/interfaces/IPostMetricsRepository";
import { PostMetricsPort } from "@postMetrics/domain/interfaces/PostMetricsPort";
import { PostMetricsRepository } from "@postMetrics/infra/database/PostMetricsRepository";
import { PostMetricsAdapter } from "@postMetrics/infra/PostMetricsAdapter";
import { Container } from "inversify";

export function PostMetricsComposeModule(container: Container) {
  container
    .bind<IPostMetricsRepository>(TYPES.IPostMetricsRepository)
    .to(PostMetricsRepository)
    .inRequestScope();

  container
    .bind<PostMetricsPort>(TYPES.PostMetricsPort)
    .to(PostMetricsAdapter)
    .inRequestScope();
}
