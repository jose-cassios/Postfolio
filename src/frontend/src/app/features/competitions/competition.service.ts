import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../auth/services/auth.service';

export type CompetitionStatus = 'UPCOMING' | 'REGISTRATION' | 'WAITING_VOTING' | 'VOTING' | 'WAITING_RESULTS' | 'RESULTS';

export interface CompetitionProject {
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

export interface Competition {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  registrationStartsAt: string | null;
  registrationEndsAt: string | null;
  votingStartsAt: string | null;
  votingEndsAt: string | null;
  resultsAt: string | null;
  resultsFinalizedAt: string | null;
  status: CompetitionStatus;
  minimumEvaluations: number;
  criteria: Array<{ id: string; name: string; weight: number; position: number }>;
  submissions: CompetitionProject[];
}

export interface CompetitionPayload {
  name: string;
  description: string;
  category: string;
  registrationStartsAt: string;
  registrationEndsAt: string;
  votingStartsAt: string;
  votingEndsAt: string;
  resultsAt: string;
  minimumEvaluations: number;
  criteria: Array<{ name: string; weight: number }>;
}

export interface EvaluationProgress {
  participant: boolean;
  evaluatedProjects: number;
  requiredEvaluations: number;
  completed: boolean;
}

@Injectable({ providedIn: 'root' })
export class CompetitionService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  list() { return this.api.get<Competition[]>('competition'); }

  create(payload: CompetitionPayload) {
    return this.api.post<Competition>('competition', payload, this.auth.authOptions());
  }

  subscribe(competitionId: string, projectId: string) {
    return this.api.post(
      `competition/${competitionId}/projects/${projectId}`,
      {},
      this.auth.authOptions(),
    );
  }

  unsubscribe(competitionId: string, projectId: string) {
    return this.api.delete(
      `competition/${competitionId}/projects/${projectId}`,
      this.auth.authOptions(),
    );
  }

  evaluate(
    competitionId: string,
    projectId: string,
    scores: Array<{ criterionId: string; score: number }>,
  ) {
    return this.api.put(
      `competition/${competitionId}/evaluations/${projectId}`,
      { scores },
      this.auth.authOptions(),
    );
  }

  evaluationProgress(competitionId: string) {
    return this.api.get<EvaluationProgress>(
      `competition/${competitionId}/evaluation-progress`,
      undefined,
      this.auth.authOptions(),
    );
  }

  finalizeResults(competitionId: string) {
    return this.api.post<Competition>(
      `competition/${competitionId}/finalize-results`,
      {},
      this.auth.authOptions(),
    );
  }
}
