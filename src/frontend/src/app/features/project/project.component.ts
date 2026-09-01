import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ProjectDetails } from '../../shared/models/project-details';
import {
  ProjectComment,
  PostmarkStatus,
  ProjectPostmark,
  ProjectInteraction,
  ProjectService,
} from '../../shared/services/project.service';

@Component({
  selector: 'app-project',
  imports: [CommonModule, FormsModule, MatIconModule, RouterLink],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projects = inject(ProjectService);
  private readonly auth = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly project = signal<ProjectDetails | null>(null);
  readonly interaction = signal<ProjectInteraction>({
    liked: false,
    postmarked: false,
    saved: false,
    likes: 0,
    postmarks: 0,
  });
  readonly comments = signal<ProjectComment[]>([]);
  readonly showPostmarkForm = signal(false);
  readonly isLoading = signal(true);
  readonly actionPending = signal(false);
  readonly errorMessage = signal('');
  readonly notice = signal('');
  readonly nextCommentsCursor = signal<string | null>(null);
  readonly hasMoreComments = signal(false);
  readonly isOwner = computed(() =>
    this.project()?.author?.username === this.auth.user()?.username,
  );
  commentText = '';
  selectedAspect = '';
  postmarkStrength = '';
  postmarkSuggestion = '';
  postmarkComment = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('slug');
    if (!id) {
      this.errorMessage.set('Projeto inválido.');
      this.isLoading.set(false);
      return;
    }

    this.projects.getById(id).pipe(finalize(() => this.isLoading.set(false))).subscribe({
      next: (project) => {
        this.project.set(project);
        this.selectedAspect = project.feedbackAspects[0] ?? 'UX';
        this.interaction.update((state) => ({
          ...state,
          likes: project.likes,
        postmarks: project.postmarksCount,
        }));
        this.loadComments();
        if (this.auth.isAuthenticated()) {
          this.projects.getInteraction(id).subscribe({
            next: (interaction) => this.interaction.set(interaction),
          });
        }
      },
      error: () => this.errorMessage.set('Este projeto não foi encontrado.'),
    });
  }

  toggleLike() {
    const project = this.project();
    if (!project || !this.requireAuthentication() || this.actionPending()) return;
    this.actionPending.set(true);
    this.projects.setLike(project.id, !this.interaction().liked)
      .pipe(finalize(() => this.actionPending.set(false)))
      .subscribe({ next: (state) => this.interaction.set(state), error: () => this.showError() });
  }

  openPostmark(): void {
    if (!this.requireAuthentication() || this.isOwner()) return;
    this.showPostmarkForm.set(true);
  }

  submitPostmark() {
    const project = this.project();
    if (!project || !this.requireAuthentication() || this.actionPending()) return;
    if (
      !this.selectedAspect
      || this.postmarkStrength.trim().length < 3
      || this.postmarkSuggestion.trim().length < 3
    ) return;
    this.actionPending.set(true);
    this.projects.createPostmark(project.id, {
      aspect: this.selectedAspect,
      strength: this.postmarkStrength.trim(),
      suggestion: this.postmarkSuggestion.trim(),
      additionalComment: this.postmarkComment.trim() || null,
    })
      .pipe(finalize(() => this.actionPending.set(false)))
      .subscribe({
        next: (postmark) => {
          this.project.update((current) => current ? {
            ...current,
            postmarks: [
              postmark,
              ...current.postmarks.filter((item) => item.id !== postmark.id),
            ],
          } : current);
          this.interaction.update((state) => ({
            ...state,
            postmarked: true,
            postmarks: state.postmarked ? state.postmarks : state.postmarks + 1,
          }));
          this.postmarkStrength = '';
          this.postmarkSuggestion = '';
          this.postmarkComment = '';
          this.showPostmarkForm.set(false);
          this.notice.set('Postmark enviado para o autor.');
        },
        error: () => this.showError(),
      });
  }

  updatePostmarkStatus(
    postmark: ProjectPostmark,
    status: PostmarkStatus,
  ): void {
    const project = this.project();
    if (!project || !this.isOwner() || this.actionPending()) return;
    this.actionPending.set(true);
    this.projects.updatePostmarkStatus(project.id, postmark.id, status)
      .pipe(finalize(() => this.actionPending.set(false)))
      .subscribe({
        next: (updated) => this.project.update((current) => current ? {
          ...current,
          postmarks: current.postmarks.map((item) =>
            item.id === updated.id ? updated : item
          ),
        } : current),
        error: () => this.showError(),
      });
  }

  aspectLabel(aspect: string): string {
    return ({
      UI: 'UI', UX: 'UX', ARCHITECTURE: 'Arquitetura', CODE: 'Código',
      PERFORMANCE: 'Performance', ACCESSIBILITY: 'Acessibilidade',
      ORIGINALITY: 'Originalidade', DOCUMENTATION: 'Documentação',
    } as Record<string, string>)[aspect] ?? aspect;
  }

  feedbackAspectOptions(project: ProjectDetails): string[] {
    return project.feedbackAspects.length
      ? project.feedbackAspects
      : ['UI', 'UX', 'ARCHITECTURE', 'CODE', 'PERFORMANCE', 'ACCESSIBILITY', 'ORIGINALITY', 'DOCUMENTATION'];
  }

  postmarkStatusLabel(status: PostmarkStatus): string {
    return ({
      PENDING: 'Pendente', USEFUL: 'Útil', APPLIED: 'Aplicado', DENIED: 'Recusado',
    })[status];
  }

  toggleSaved() {
    const project = this.project();
    if (!project || !this.requireAuthentication() || this.actionPending()) return;
    const saved = !this.interaction().saved;
    this.actionPending.set(true);
    this.projects.setSaved(project.id, saved)
      .pipe(finalize(() => this.actionPending.set(false)))
      .subscribe({
        next: () => this.interaction.update((state) => ({ ...state, saved })),
        error: () => this.showError(),
      });
  }

  hire() {
    const project = this.project();
    if (!project || !this.requireAuthentication()) return;
    this.projects.getContact(project.id).subscribe({
      next: (contact) => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.href = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(`Contato pelo Postfolio — ${project.title}`)}`;
        }
      },
      error: () => this.notice.set('Este autor não está disponível para contratação no momento.'),
    });
  }

  share() {
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard?.writeText(window.location.href);
    this.notice.set('Link copiado.');
  }

  addComment() {
    const project = this.project();
    const content = this.commentText.trim();
    if (!project || !content || !this.requireAuthentication()) return;
    this.projects.addComment(project.id, content).subscribe({
      next: (comment) => {
        this.comments.update((comments) => [comment, ...comments]);
        this.commentText = '';
      },
      error: () => this.notice.set('Não foi possível enviar o comentário.'),
    });
  }

  loadComments(cursor?: string | null) {
    const project = this.project();
    if (!project) return;
    this.projects.getComments(project.id, cursor).subscribe({
      next: (response) => {
        this.comments.update((comments) => cursor ? [...comments, ...response.data] : response.data);
        this.nextCommentsCursor.set(response.pagination.next_cursor);
        this.hasMoreComments.set(response.pagination.has_next_page);
      },
    });
  }

  private requireAuthentication(): boolean {
    if (this.auth.isAuthenticated()) return true;
    this.router.navigate(['/auth/login'], { queryParams: { redirect: this.router.url } });
    return false;
  }

  private showError() {
    this.notice.set('Não foi possível concluir a ação. Tente novamente.');
  }
}
