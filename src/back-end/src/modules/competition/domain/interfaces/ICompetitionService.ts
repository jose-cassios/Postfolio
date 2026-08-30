import { CompetitionContract, CreateCompetitionDTO } from "@competition/api/CompetitionDTO";
import { Competition } from "@competition/domain/entities/Competition";
// import Work from "@domain/entities/work/Work";

export interface ICompetitionService {
  create(dto: CreateCompetitionDTO, userId: string): Promise<Competition>;
  update(competition: Competition): Promise<Competition>;
  delete(id: string): Promise<Competition | null>;

  subscribeProject(competitionId: string, projectId: string, userId: string): Promise<void>;
  unsubscribeProject(competitionId: string, projectId: string, userId: string): Promise<void>;
  vote(competitionId: string, projectId: string, userId: string): Promise<void>;

  findMany(): Promise<Competition[]>;
  findById(id: string): Promise<Competition | null>;
  findContracts(): Promise<CompetitionContract[]>;
  findContractById(id: string): Promise<CompetitionContract>;

  // createRating(ratingDto: CreaetRatingDTO): Promise<Rating>;
  // updateRating(rating: Rating): Promise<Rating>;
  // deleteRating(id: string): Promise<Rating>;
  // findRating(id: string): Promise<Rating | null>;
}
