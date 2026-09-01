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

export type ReputationAxisContract = "CREATOR" | "CONTRIBUTOR";

export interface ReputationEventContract {
  id: string;
  userId: string;
  type: string;
  axis: ReputationAxisContract;
  points: number;
  projectId: string | null;
  postmarkId: string | null;
  projectVersionId: string | null;
  eventId: string | null;
  reason: string | null;
  adminId: string | null;
  reversalOfId: string | null;
  createdAt: Date;
  reversal: {
    id: string;
    points: number;
    reason: string | null;
    createdAt: Date;
  } | null;
  reversible: boolean;
}

export interface ReputationHistoryContract {
  totals: {
    creatorXp: number;
    contributorXp: number;
  };
  events: ReputationEventContract[];
}

export interface ReputationAdjustmentInput {
  axis: ReputationAxisContract;
  points: number;
  reason: string;
  idempotencyKey: string;
}

export interface ReputationReversalInput {
  reason: string;
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
