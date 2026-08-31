import { Competition } from "@competition/domain/entities/Competition";
import { CompetitionContract, EvaluationProgressContract, EventEvaluationInput } from "@competition/api/CompetitionDTO";

export interface ICompetitionRepository {
  create(competition: Competition): Promise<Competition>;
  update(competition: Competition): Promise<Competition>;
  deleteById(id: string): Promise<Competition | null>;

  findById(id: string): Promise<Competition | null>;
  findMany(): Promise<Competition[]>;
  findContracts(): Promise<CompetitionContract[]>;
  findContractById(id: string): Promise<CompetitionContract | null>;
  subscribeProject(competitionId: string, projectId: string): Promise<void>;
  unsubscribeProject(competitionId: string, projectId: string): Promise<void>;
  upsertEvaluation(
    competitionId: string,
    projectId: string,
    userId: string,
    scores: EventEvaluationInput[],
  ): Promise<void>;
  getEvaluationProgress(
    competitionId: string,
    userId: string,
  ): Promise<EvaluationProgressContract>;

  // createProjectCompDetails(
  //   workCompDetails: WorkCompDetails
  // ): Promise<WorkCompDetails>;
  // updateWorkCompDetails(
  //   workCompDetails: WorkCompDetails
  // ): Promise<WorkCompDetails>;
  // deleteWorkCompDetails(id: string): Promise<WorkCompDetails | null>;

  // findWorkCompDetails(
  //   competitionId: string,
  //   workId: string
  // ): Promise<WorkCompDetails | null>;
  // findWorkCompDetailsByCompetition(
  //   competitionId: string
  // ): Promise<WorkCompDetails[]>;
  // findWorkCompDetailsById(id: string): Promise<WorkCompDetails | null>;
  // findWorkCompDetailsByIdWihtRatings(
  //   id: string
  // ): Promise<WorkCompDetails[] | null>;
}
