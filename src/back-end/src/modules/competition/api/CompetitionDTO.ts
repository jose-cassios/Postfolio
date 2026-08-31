export interface CreateCompetitionDTO {
  name: string;
  description: string;
  category: string;
  registrationStartsAt: Date;
  registrationEndsAt: Date;
  votingStartsAt: Date;
  votingEndsAt: Date;
  resultsAt: Date;
  minimumEvaluations: number;
  criteria: Array<{ name: string; weight: number }>;
}

export interface EventCriterionContract {
  id: string;
  name: string;
  weight: number;
  position: number;
}

export interface CompetitionProjectContract {
  id: string;
  name: string;
  coverImageUrl: string | null;
  tools: string[];
  author: { id: string; username: string };
  score?: number;
  primaryCriterionScore?: number;
  evaluationCount?: number;
  rank?: number;
}

export interface CompetitionContract {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
  registrationStartsAt: Date | null;
  registrationEndsAt: Date | null;
  votingStartsAt: Date | null;
  votingEndsAt: Date | null;
  resultsAt: Date | null;
  status: "UPCOMING" | "REGISTRATION" | "WAITING_VOTING" | "VOTING" | "WAITING_RESULTS" | "RESULTS";
  minimumEvaluations: number;
  criteria: EventCriterionContract[];
  submissions: CompetitionProjectContract[];
}

export interface EventEvaluationInput {
  criterionId: string;
  score: number;
}

export interface EvaluationProgressContract {
  participant: boolean;
  evaluatedProjects: number;
  requiredEvaluations: number;
  completed: boolean;
}

export interface UpdateCompetionDTO {
  id: string
  name?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date;
}
