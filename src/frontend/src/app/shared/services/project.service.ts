import { Injectable, inject } from '@angular/core';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { Project } from '../models/project';
import { ProjectDetails } from '../models/project-details';
import { ProjectDocument, ProjectEditorPayload } from '../models/project-content';

interface ProjectApiContract extends ProjectDocument {
  author?: {
    id: string;
    username: string;
    bio: string;
    availableForHire: boolean;
  };
  metrics?: { likes: number; appreciates: number; comments: number; saves: number };
  publicFeedback?: Array<{ id: string; content: string; username: string }>;
}

interface ProjectPageApi {
  data: ProjectApiContract[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ProjectQuery {
  q?: string;
  category?: string;
  tool?: string;
  tag?: string;
  sort?: 'newest' | 'likes' | 'appreciates';
  page?: number;
  limit?: number;
}

export interface ProjectPage {
  data: Project[];
  pagination: ProjectPageApi['pagination'];
}

export interface ProjectInteraction {
  liked: boolean;
  appreciated: boolean;
  saved: boolean;
  likes: number;
  appreciates: number;
}

export interface ProjectContact {
  username: string;
  email: string;
  linkedin: string | null;
  github: string | null;
  website: string | null;
}

export interface ProjectComment {
  id: string;
  content: string;
  userId: string;
  projectId: string;
  createdAt: string;
}

export interface ProjectFeedback {
  id: string;
  content: string;
  username: string;
}

interface CommentPage {
  data: ProjectComment[];
  pagination: { next_cursor: string | null; has_next_page: boolean };
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  list(query: ProjectQuery = {}) {
    const params = Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
    );
    return this.api.get<ProjectPageApi>('project', params).pipe(
      map((response) => ({
        data: response.data.map((project) => this.mapProject(project)),
        pagination: response.pagination,
      })),
    );
  }

  getById(id: string) {
    return this.api
      .get<ProjectApiContract>(`project/${encodeURIComponent(id)}`)
      .pipe(map((project) => this.mapDetails(project)));
  }

  getForEditor(id: string) {
    return this.api.get<ProjectDocument>(
      `project/${encodeURIComponent(id)}/editor`,
      undefined,
      this.auth.authOptions(),
    );
  }

  createProject(payload: ProjectEditorPayload) {
    return this.api.post<ProjectDocument>('project', payload, this.auth.authOptions());
  }

  updateProject(id: string, payload: ProjectEditorPayload) {
    return this.api.put<ProjectDocument>(
      `project/${encodeURIComponent(id)}`,
      payload,
      this.auth.authOptions(),
    );
  }

  getInteraction(id: string) {
    return this.api.get<ProjectInteraction>(
      `project/${encodeURIComponent(id)}/interaction`,
      undefined,
      this.auth.authOptions(),
    );
  }

  setLike(id: string, liked: boolean) {
    return this.api.put<ProjectInteraction>(
      `project/${encodeURIComponent(id)}/like`,
      { liked },
      this.auth.authOptions(),
    );
  }

  setAppreciation(
    id: string,
    appreciated: boolean,
    feedback?: { content: string; type: 'PUBLIC' | 'PRIVATE' },
  ) {
    return this.api.put<ProjectInteraction>(
      `project/${encodeURIComponent(id)}/appreciate`,
      { appreciated, feedback },
      this.auth.authOptions(),
    );
  }

  setSaved(id: string, saved: boolean) {
    return saved
      ? this.api.post(`favorate`, { project: id }, this.auth.authOptions())
      : this.api.delete(`favorate/${encodeURIComponent(id)}`, this.auth.authOptions());
  }

  getContact(id: string) {
    return this.api.get<ProjectContact>(
      `project/${encodeURIComponent(id)}/contact`,
      undefined,
      this.auth.authOptions(),
    );
  }

  getPrivateFeedback(id: string) {
    return this.api.get<ProjectFeedback[]>(
      `project/${encodeURIComponent(id)}/private-feedback`,
      undefined,
      this.auth.authOptions(),
    );
  }

  getComments(id: string, cursor?: string | null) {
    return this.api.get<CommentPage>(
      `comments/${encodeURIComponent(id)}`,
      cursor ? { cursor } : {},
    );
  }

  addComment(id: string, content: string) {
    return this.api.post<ProjectComment>(
      'comments',
      { project: id, content },
      this.auth.authOptions(),
    );
  }

  getSavedProjects() {
    return this.api
      .get<Array<{ projectId: string }>>('favorate', undefined, this.auth.authOptions())
      .pipe(
        switchMap((saved) =>
          saved.length
            ? forkJoin(saved.map((item) => this.getById(item.projectId)))
            : of([] as ProjectDetails[]),
        ),
      );
  }

  private mapProject(project: ProjectApiContract): Project {
    return {
      id: project.id,
      slug: project.id,
      title: project.name,
      imageUrl: project.coverImageUrl,
      likes: project.metrics?.likes ?? 0,
      appreciates: project.metrics?.appreciates ?? 0,
      saves: project.metrics?.saves ?? 0,
      views: 0,
      commentsCount: project.metrics?.comments ?? 0,
      createdAt: new Date(project.createdAt),
      author: project.author
        ? {
            name: project.author.username,
            username: project.author.username,
            bio: project.author.bio,
            availableForHire: project.author.availableForHire,
          }
        : undefined,
      technologies: project.tools,
      tags: project.tags,
      category: project.category,
      description: project.description,
      gallery: project.galleryUrls,
      githubLink: project.githubLink,
      externalLink: project.externalLink,
      contentBlocks: project.contentBlocks ?? [],
      contentMarkdown: project.contentMarkdown ?? '',
      status: project.status ?? 'PUBLISHED',
      publishedAt: project.publishedAt ?? project.createdAt,
    };
  }

  private mapDetails(project: ProjectApiContract): ProjectDetails {
    const base = this.mapProject(project);
    return {
      ...base,
      coverImageUrl: project.coverImageUrl,
      description: project.description,
      gallery: project.galleryUrls,
      appreciates: project.metrics?.appreciates ?? 0,
      saves: project.metrics?.saves ?? 0,
      tags: project.tags,
      publishedAt: project.publishedAt ?? project.createdAt,
      contentBlocks: project.contentBlocks ?? [],
      contentMarkdown: project.contentMarkdown ?? '',
      status: project.status ?? 'PUBLISHED',
      publicFeedback: project.publicFeedback ?? [],
    };
  }
}
