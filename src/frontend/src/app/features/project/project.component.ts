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
  ProjectFeedback,
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
    appreciated: false,
    saved: false,
    likes: 0,
    appreciates: 0,
  });
  readonly comments = signal<ProjectComment[]>([]);
  readonly privateFeedback = signal<ProjectFeedback[]>([]);
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
  feedbackText = '';
  feedbackPrivate = false;

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
        this.interaction.update((state) => ({
          ...state,
          likes: project.likes,
          appreciates: project.appreciates,
        }));
        this.loadComments();
        if (this.auth.isAuthenticated()) {
          this.projects.getInteraction(id).subscribe({
            next: (interaction) => this.interaction.set(interaction),
          });
          if (project.author?.username === this.auth.user()?.username) {
            this.projects.getPrivateFeedback(id).subscribe({
              next: (feedback) => this.privateFeedback.set(feedback),
            });
          }
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

  toggleAppreciation(withFeedback = false) {
    const project = this.project();
    if (!project || !this.requireAuthentication() || this.actionPending()) return;
    const feedback = withFeedback && this.feedbackText.trim()
      ? {
          content: this.feedbackText.trim(),
          type: this.feedbackPrivate ? 'PRIVATE' as const : 'PUBLIC' as const,
        }
      : undefined;
    this.actionPending.set(true);
    const appreciated = withFeedback ? true : !this.interaction().appreciated;
    this.projects.setAppreciation(project.id, appreciated, feedback)
      .pipe(finalize(() => this.actionPending.set(false)))
      .subscribe({
        next: (state) => {
          this.interaction.set(state);
          this.feedbackText = '';
          this.notice.set(state.appreciated ? 'Projeto apreciado com sucesso.' : 'Apreciação removida.');
          if (withFeedback) this.ngOnInit();
        },
        error: () => this.showError(),
      });
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
