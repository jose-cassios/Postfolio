import { ProjectCompDetails } from "@projectCompDetails/domain/entitite/ProjectCompDetails";

export interface IProjectCompDetailsRepository {
  create(projectCompDetails: ProjectCompDetails): Promise<ProjectCompDetails>;
  update(projectCompDetails: ProjectCompDetails): Promise<ProjectCompDetails>;
  delete(id: string): Promise<ProjectCompDetails>;

  findById(id: string): Promise<ProjectCompDetails | null>;
  findByCompetitionIdAndPortfolioId(
    competitionId: string,
    projectId: string
  ): Promise<ProjectCompDetails | null>;
}
