export interface UserAchievementContract {
  competitionId: string;
  competitionName: string;
  rank: number;
}

export interface UserReputationContract {
  creatorScore: number;
  contributorScore: number;
  evidence: {
    publishedProjects: number;
    versionsCreated: number;
    appreciatesSent: number;
    usefulFeedbacks: number;
    appliedSuggestions: number;
    recognizedContributions: number;
  };
}
