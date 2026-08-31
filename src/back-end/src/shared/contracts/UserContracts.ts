export interface UserAchievementContract {
  competitionId: string;
  competitionName: string;
  rank: number;
}

export type ReputationRankContract =
  | "F"
  | "F+"
  | "E"
  | "E+"
  | "D"
  | "D+"
  | "C"
  | "C+"
  | "B"
  | "B+"
  | "A"
  | "A+"
  | "S"
  | "SS";

export interface ReputationRankConfigContract {
  rank: ReputationRankContract;
  requiredXp: number;
}

export interface UserReputationContract {
  creatorXp: number;
  contributorXp: number;
  creatorRank: ReputationRankContract;
  contributorRank: ReputationRankContract;
  evidence: {
    publishedProjects: number;
    versionsCreated: number;
    postmarksSent: number;
    usefulFeedbacks: number;
    appliedSuggestions: number;
    recognizedContributions: number;
  };
}
