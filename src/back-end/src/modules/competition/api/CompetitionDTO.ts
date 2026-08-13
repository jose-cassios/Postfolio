export interface CreateCompetitionDTO {
  name: string;
  description: string;
  category: string;
  registrationStartsAt: Date;
  registrationEndsAt: Date;
  votingStartsAt: Date;
  votingEndsAt: Date;
  resultsAt: Date;
}

export interface CompetitionProjectContract {
  id: string;
  name: string;
  coverImageUrl: string | null;
  tools: string[];
  author: { id: string; username: string };
  votes?: number;
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
  submissions: CompetitionProjectContract[];
}

export interface UpdateCompetionDTO {
  id: string
  name?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date;
}
