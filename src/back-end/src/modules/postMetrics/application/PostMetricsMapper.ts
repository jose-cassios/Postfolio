import { PostMetrics } from "@postMetrics/domain/entities/PostMetrics";
import { PostMetrics as PostMetricsModel } from "@prisma/client";

export const PostMetricsMapper = {
  fromDomainToPrisma(domain: PostMetrics): PostMetricsModel {
    return {
      id: domain.getId(),
      appreciateCount: domain.getCauntAppreciate(),
      projectId: domain.getProjectId(),
    };
  },

  fromPrismaToDomain(model: PostMetricsModel): PostMetrics {
    return new PostMetrics(model.id, model.appreciateCount, model.projectId);
  },
};
