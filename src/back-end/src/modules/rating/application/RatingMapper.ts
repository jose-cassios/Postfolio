import { Rating as RatingModel } from "@PrismaGen/client";
import { Rating } from "@rating/domain/entities/Rating";
import { UpsertRatingDTO } from "@rating/api/RatingDTO";

export const RatingMapper = {
  fromUpsertRatingDTOtoDomain(
    dto: UpsertRatingDTO,
    projectDetailsId: string
  ): Rating {
    return new Rating(
      "",
      dto.score,
      dto.userId,
      dto.projectId,
      dto.competitionId,
      projectDetailsId
    );
  },
  fromPrismaToDomin(model: RatingModel): Rating {
    return new Rating(
      model.id,
      model.score,
      model.userId,
      model.projectId,
      model.competitionId,
      model.projectCompDetailsID
    );
  },
  fromDomainToPrisma(rating: Rating): RatingModel {
    return {
      id: rating.getId(),
      score: rating.getScore(),
      userId: rating.getUserId(),
      projectId: rating.getProjectId(),
      competitionId: rating.getCompetitionId(),
      projectCompDetailsID: rating.getProjectCompDetailsId(),
    };
  },
};
