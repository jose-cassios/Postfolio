import { ProjectCompDetails } from "@projectCompDetails/domain/entitite/ProjectCompDetails";
import { ProjectCompDetails as ProjectCompDetailsModel } from "@prisma/client";

export const ProjectCompDetailsMapper = {
  fromDomainToPrisma(domain: ProjectCompDetails): ProjectCompDetailsModel {
    return {
      id: domain.id,
      totalReviewers: domain.totalReviewers,
      totalScore: domain.totalScore,
      projectId: domain.projectId,
      competitionId: domain.competitionId,
    };
  },
  fromPrismaToDomain(model: ProjectCompDetailsModel): ProjectCompDetails {
    return new ProjectCompDetails(
      model.id,
      model.totalReviewers,
      model.totalScore,
      model.competitionId,
      model.projectId
    );
  },
  //   from
};
