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

export interface ReputationRankProgressContract {
  rank: ReputationRankContract;
  xp: number;
  nextRank: ReputationRankContract | null;
  xpRequired: number | null;
  xpRemaining: number;
  progressPercent: number;
  mission: string | null;
  missionCurrentValue: number | null;
  missionRequiredValue: number | null;
  missionCompleted: boolean;
}

export interface UserReputationContract {
  creator: ReputationRankProgressContract;
  contributor: ReputationRankProgressContract;
  evidence: {
    publishedProjects: number;
    versionsCreated: number;
    postmarksSent: number;
    usefulFeedbacks: number;
    appliedSuggestions: number;
    recognizedContributions: number;
  };
}
