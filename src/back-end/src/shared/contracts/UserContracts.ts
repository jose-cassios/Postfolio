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
    postmarksSent: number;
    usefulFeedbacks: number;
    appliedSuggestions: number;
    recognizedContributions: number;
  };
}
