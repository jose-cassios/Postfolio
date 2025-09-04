import { Comments } from "@comments/domain/entities/Comments";
import { Comments as CommentsModel } from "@prisma/client";

export const CommentsMapper = {
  fromDomainToPrisma(comment: Comments): CommentsModel {
    return {
      id: comment.getId(),
      content: comment.getContent(),
      userId: comment.getUserId(),
      projectId: comment.getProjectId(),
      created_at: comment.getCreatedAt(),
    };
  },
  fromPrismaToDomain(model: CommentsModel) {
    return new Comments(
      model.id,
      model.content,
      model.userId,
      model.projectId,
      model.created_at
    );
  },
};
