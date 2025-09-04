import { ProjectCompDetailsContract } from "@shared/contracts/ProjectCompDetailsContract";
import {
  RatingContracts,
  RatingDiffContract,
} from "@shared/contracts/RatingContracts";

export interface ProjectCompDetailsPort {
  create(data: ProjectCompDetailsContract): Promise<void>;
  recalculate(diff: RatingDiffContract): Promise<void>;
  delete(competitionId: string, projectId: string): Promise<void>;

  exist(
    competitionId: string,
    projectId: string
  ): Promise<ProjectCompDetailsContract | null>;
}
