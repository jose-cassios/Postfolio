import { ProjectCompDetails } from "@projectCompDetails/domain/entitite/ProjectCompDetails";
import { ProjectCompDetails as ProjectCompDetailsModel } from "@prisma/client";
import { ProjectCompDetailsContract } from "@shared/contracts/ProjectCompDetailsContract";

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
  fromContractToDomain(
    contract: ProjectCompDetailsContract
  ): ProjectCompDetails {
    const id = contract.id ? contract.id : "";

    return new ProjectCompDetails(
      id,
      contract.totalReviewers,
      contract.totalScore,
      contract.competitionId,
      contract.projectId
    );
  },
  fromDomainToContract(domain: ProjectCompDetails): ProjectCompDetailsContract {
    return {
      id: domain.id,
      totalReviewers: domain.totalReviewers,
      totalScore: domain.totalScore,
      projectId: domain.projectId,
      competitionId: domain.competitionId,
      checked: true,
    };
  },
};
