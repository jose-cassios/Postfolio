import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ProfileProject } from '../profile/profile.models';
import { ProfileService } from '../profile/profile.service';
import { Competition, CompetitionService, CompetitionStatus } from './competition.service';

@Component({
  selector: 'app-competitions',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.scss',
})
export class CompetitionsComponent {
  private readonly service = inject(CompetitionService);
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly competitions = signal<Competition[]>([]);
  readonly myProjects = signal<ProfileProject[]>([]);
  readonly loading = signal(true);
  readonly pending = signal(false);
  readonly notice = signal('');
  readonly error = signal('');
  readonly selectedProjects: Record<string, string> = {};

  ngOnInit() {
    this.load();
    const username = this.auth.user()?.username;
    if (username) {
      this.profileService.getProjects(username).subscribe({
        next: (projects) => this.myProjects.set(
          projects.filter((project) => project.status === 'PUBLISHED'),
        ),
      });
    }
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service.list().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (competitions) => this.competitions.set(competitions),
      error: () => this.error.set('Não foi possível carregar as competições.'),
    });
  }

  subscribe(competition: Competition) {
    if (!this.requireAuthentication()) return;
    const projectId = this.selectedProjects[competition.id];
    if (!projectId) return;
    this.run(() => this.service.subscribe(competition.id, projectId), 'Projeto inscrito.');
  }

  unsubscribe(competition: Competition, projectId: string) {
    this.run(() => this.service.unsubscribe(competition.id, projectId), 'Inscrição removida.');
  }

  vote(competition: Competition, projectId: string) {
    if (!this.requireAuthentication()) return;
    this.run(() => this.service.vote(competition.id, projectId), 'Seu voto foi registrado.');
  }

  isMyProject(project: { author: { id: string } }) {
    return project.author.id === this.auth.user()?.id;
  }

  statusLabel(status: CompetitionStatus) {
    return ({
      UPCOMING: 'Em breve',
      REGISTRATION: 'Inscrições abertas',
      WAITING_VOTING: 'Aguardando votação',
      VOTING: 'Votação aberta',
      WAITING_RESULTS: 'Aguardando resultados',
      RESULTS: 'Resultados',
    })[status];
  }

  private run(request: () => ReturnType<CompetitionService['vote']>, message: string) {
    if (this.pending()) return;
    this.pending.set(true);
    this.notice.set('');
    request().pipe(finalize(() => this.pending.set(false))).subscribe({
      next: () => { this.notice.set(message); this.load(); },
      error: (error) => this.notice.set(error?.error?.message || 'Não foi possível concluir a ação.'),
    });
  }

  private requireAuthentication() {
    if (this.auth.isAuthenticated()) return true;
    this.router.navigate(['/auth/login'], { queryParams: { redirect: '/competicoes' } });
    return false;
  }
}
