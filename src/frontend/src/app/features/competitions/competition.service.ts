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
  votes?: number;
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
  status: CompetitionStatus;
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

  vote(competitionId: string, projectId: string) {
    return this.api.post(
      `competition/${competitionId}/votes/${projectId}`,
      {},
      this.auth.authOptions(),
    );
  }
}
