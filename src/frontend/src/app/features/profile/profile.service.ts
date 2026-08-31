import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../auth/services/auth.service';
import {
  Portfolio,
  ProfileProject,
  ProfileUser,
} from './profile.models';

interface ProfileResponse {
  data: ProfileUser;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  getProfile(username: string) {
    return this.api.get<ProfileResponse>(
      `user/profile/${encodeURIComponent(username)}`,
    );
  }

  getPortfolio(username: string) {
    return this.api.get<Portfolio | null>(
      `portfolio/user/${encodeURIComponent(username)}`,
    );
  }

  getProjects(username: string) {
    if (this.auth.user()?.username === username) {
      return this.api.get<ProfileProject[]>(
        'project/mine',
        undefined,
        this.auth.authOptions(),
      );
    }

    return this.api.get<ProfileProject[]>(
      `portfolio/user/${encodeURIComponent(username)}/projects`,
    );
  }

  deleteProject(projectId: string) {
    return this.api.delete<ProfileProject>(
      `project/${projectId}`,
      this.auth.authOptions(),
    );
  }
}
