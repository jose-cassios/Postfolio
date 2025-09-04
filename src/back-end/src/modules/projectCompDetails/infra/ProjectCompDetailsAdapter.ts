import { TYPES } from "@compositionRoot/Types";
import { ProjectCompDetailsMapper } from "@projectCompDetails/application/ProjectCompDetailsMapper";
import { IProjectCompDetailsRepository } from "@projectCompDetails/domain/interfaces/IProjectCompDetailsRepository";
import { ProjectCompDetailsPort } from "@projectCompDetails/domain/interfaces/ProjectCompDetailsPort";
import { ProjectCompDetailsContract } from "@shared/contracts/ProjectCompDetailsContract";
import { RatingDiffContract } from "@shared/contracts/RatingContracts";
import { NotFound } from "@shared/error/HttpError";
import { inject, injectable } from "inversify";

@injectable()
export class ProjectCompDetailsAdapter implements ProjectCompDetailsPort {
  constructor(
    @inject(TYPES.IProjectCompDetailsRepository)
    private repository: IProjectCompDetailsRepository
  ) {}

  async create(data: ProjectCompDetailsContract): Promise<void> {
    await this.repository.create(
      ProjectCompDetailsMapper.fromContractToDomain(data)
    );
  }

  async recalculate(diff: RatingDiffContract): Promise<void> {
    const details = await this.repository.findByCompetitionIdAndPortfolioId(
      diff.competitionId,
      diff.projectId
    );

    if (!details) throw new NotFound("Recurso não encontrado!");

    details.recalculate(diff.scoreDiff, diff.reviewersDiff);

    await this.repository.update(details);
  }

  async delete(competitionId: string, projectId: string): Promise<void> {
    await this.delete(competitionId, projectId);
  }

  async exist(
    competitionId: string,
    projectId: string
  ): Promise<ProjectCompDetailsContract | null> {
    const domain = await this.repository.findByCompetitionIdAndPortfolioId(
      competitionId,
      projectId
    );

    return domain
      ? ProjectCompDetailsMapper.fromDomainToContract(domain)
      : null;
  }
}
