export interface RatingContracts {
  id: string;
  score: number;
  userId: string;
  portfolioId: string;
  competitionId: string;
}

export interface RatingDiffContract {
  competitionId: string;
  projectId: string;
  scoreDiff: number;
  reviewersDiff: number;
}
