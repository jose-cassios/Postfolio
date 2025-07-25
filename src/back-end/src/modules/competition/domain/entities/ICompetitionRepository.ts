import { Competition } from "@competition/domain/entities/Competition";
import { WorkCompDetails } from "@competition/domain/entities/WorkCompDetails";
import { Rating } from "@competition/domain/entities/Rating";

export interface ICompetitionRepository {
  create(competition: Competition): Promise<Competition>;
  update(competition: Competition): Promise<Competition>;
  deleteById(id: string): Promise<Competition | null>;

  findById(id: string): Promise<Competition | null>;
  findMany(): Promise<Competition[]>;

  createWorkCompDetails(
    workCompDetails: WorkCompDetails
  ): Promise<WorkCompDetails>;
  updateWorkCompDetails(
    workCompDetails: WorkCompDetails
  ): Promise<WorkCompDetails>;
  deleteWorkCompDetails(id: string): Promise<WorkCompDetails | null>;

  findWorkCompDetails(
    competitionId: string,
    workId: string
  ): Promise<WorkCompDetails | null>;
  findWorkCompDetailsByCompetition(
    competitionId: string
  ): Promise<WorkCompDetails[]>;
  findWorkCompDetailsById(id: string): Promise<WorkCompDetails | null>;
  findWorkCompDetailsByIdWihtRatings(
    id: string
  ): Promise<WorkCompDetails[] | null>;

  // About Rating
  createRating(rating: Rating): Promise<Rating>;
  updateRating(rating: Rating): Promise<Rating>;
  deleteRating(id: string): Promise<Rating>;

  findRating(id: string): Promise<Rating | null>;
  findRatingByUserAndWorkCompDetails(
    userId: string,
    workCompDetailsId: string
  ): Promise<Rating | null>;
}
