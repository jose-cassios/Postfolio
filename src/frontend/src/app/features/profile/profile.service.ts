import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../auth/services/auth.service';
import {
  Portfolio,
  ProfileProject,
  ProfileUser,
  ProjectPayload,
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
    return this.api.get<Portfolio>(
      `portfolio/user/${encodeURIComponent(username)}`,
    );
  }

  getProjects(username: string) {
    return this.api.get<ProfileProject[]>(
      `portfolio/user/${encodeURIComponent(username)}/projects`,
    );
  }

  createProject(payload: ProjectPayload) {
    return this.api.post<ProfileProject>('project', payload, this.auth.authOptions());
  }

  updateProject(projectId: string, payload: ProjectPayload) {
    return this.api.put<ProfileProject>(
      `project/${projectId}`,
      payload,
      this.auth.authOptions(),
    );
  }

  deleteProject(projectId: string) {
    return this.api.delete<ProfileProject>(
      `project/${projectId}`,
      this.auth.authOptions(),
    );
  }
}
