import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ProfileProject } from '../profile/profile.models';
import { ProfileService } from '../profile/profile.service';
import { Competition, CompetitionPayload, CompetitionService, CompetitionStatus, EvaluationProgress } from './competition.service';

@Component({
  selector: 'app-competitions',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './competitions.component.html',
  styleUrl: './competitions.component.scss',
})
export class CompetitionsComponent {
  private readonly service = inject(CompetitionService);
  private readonly profileService = inject(ProfileService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly competitions = signal<Competition[]>([]);
  readonly myProjects = signal<ProfileProject[]>([]);
  readonly loading = signal(true);
  readonly pending = signal(false);
  readonly notice = signal('');
  readonly error = signal('');
  readonly selectedProjects: Record<string, string> = {};
  readonly evaluationScores: Record<string, number> = {};
  readonly progress = signal<Record<string, EvaluationProgress>>({});
  readonly canManageCompetitions = () =>
    ['ADMIN', 'MODERATOR'].includes(this.auth.user()?.usertype ?? '');
  readonly categories = ['FULLSTACK', 'FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DATA_ANALYSIS', 'OTHER'];

  readonly creationForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    category: ['OTHER', Validators.required],
    registrationStartsAt: ['', Validators.required],
    registrationEndsAt: ['', Validators.required],
    votingStartsAt: ['', Validators.required],
    votingEndsAt: ['', Validators.required],
    resultsAt: ['', Validators.required],
    minimumEvaluations: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
    criteria: this.fb.nonNullable.array([
      this.createCriterion('UX', 40),
      this.createCriterion('Execução', 30),
      this.createCriterion('Originalidade', 30),
    ]),
  });

  get criteriaControls() { return this.creationForm.controls.criteria.controls; }

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
      next: (competitions) => {
        this.competitions.set(competitions);
        if (this.auth.isAuthenticated()) {
          competitions.filter((competition) => competition.status === 'VOTING')
            .forEach((competition) => this.loadProgress(competition.id));
        }
      },
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

  evaluate(competition: Competition, projectId: string) {
    if (!this.requireAuthentication()) return;
    const scores = competition.criteria.map((criterion) => ({
      criterionId: criterion.id,
      score: Number(this.evaluationScores[this.scoreKey(competition.id, projectId, criterion.id)]),
    }));
    if (scores.some((score) => !Number.isInteger(score.score) || score.score < 1 || score.score > 5)) {
      this.notice.set('Dê uma nota de 1 a 5 em todos os critérios.');
      return;
    }
    this.run(
      () => this.service.evaluate(competition.id, projectId, scores),
      'Sua avaliação foi registrada.',
      () => this.loadProgress(competition.id),
    );
  }

  finalizeResults(competition: Competition) {
    if (!this.canManageCompetitions()) return;
    this.run(
      () => this.service.finalizeResults(competition.id),
      'Resultados encerrados e reputação distribuída.',
    );
  }

  canFinalizeResults(competition: Competition) {
    return Boolean(competition.resultsAt && new Date(competition.resultsAt) <= new Date());
  }

  addCriterion() {
    if (this.criteriaControls.length < 8) {
      this.creationForm.controls.criteria.push(this.createCriterion('', 1));
    }
  }

  removeCriterion(index: number) {
    if (this.criteriaControls.length > 1) {
      this.creationForm.controls.criteria.removeAt(index);
    }
  }

  createCompetition() {
    if (this.creationForm.invalid || this.pending()) {
      this.creationForm.markAllAsTouched();
      return;
    }

    const values = this.creationForm.getRawValue();
    const payload: CompetitionPayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      registrationStartsAt: new Date(values.registrationStartsAt).toISOString(),
      registrationEndsAt: new Date(values.registrationEndsAt).toISOString(),
      votingStartsAt: new Date(values.votingStartsAt).toISOString(),
      votingEndsAt: new Date(values.votingEndsAt).toISOString(),
      resultsAt: new Date(values.resultsAt).toISOString(),
      minimumEvaluations: values.minimumEvaluations,
      criteria: values.criteria.map((criterion) => ({
        name: criterion.name.trim(),
        weight: criterion.weight,
      })),
    };

    this.run(() => this.service.create(payload), 'Competição criada com sucesso.', () => {
      this.resetCreationForm();
    });
  }

  scoreKey(competitionId: string, projectId: string, criterionId: string) {
    return `${competitionId}:${projectId}:${criterionId}`;
  }

  isMyProject(project: { author: { id: string } }) {
    return project.author.id === this.auth.user()?.id;
  }

  statusLabel(status: CompetitionStatus) {
    return ({
      UPCOMING: 'Em breve',
      REGISTRATION: 'Inscrições abertas',
      WAITING_VOTING: 'Aguardando avaliação',
      VOTING: 'Avaliação aberta',
      WAITING_RESULTS: 'Aguardando resultados',
      RESULTS: 'Resultados',
    })[status];
  }

  private loadProgress(competitionId: string) {
    this.service.evaluationProgress(competitionId).subscribe({
      next: (progress) => this.progress.update((current) => ({
        ...current,
        [competitionId]: progress,
      })),
    });
  }

  private run(
    request: () => Observable<unknown>,
    message: string,
    afterSuccess?: () => void,
  ) {
    if (this.pending()) return;
    this.pending.set(true);
    this.notice.set('');
    request().pipe(finalize(() => this.pending.set(false))).subscribe({
      next: () => { this.notice.set(message); afterSuccess?.(); this.load(); },
      error: (error) => this.notice.set(error?.error?.message || 'Não foi possível concluir a ação.'),
    });
  }

  private requireAuthentication() {
    if (this.auth.isAuthenticated()) return true;
    this.router.navigate(['/auth/login'], { queryParams: { redirect: '/competicoes' } });
    return false;
  }

  private createCriterion(name: string, weight: number) {
    return this.fb.nonNullable.group({
      name: [name, [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      weight: [weight, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  private resetCreationForm() {
    const criteria = this.creationForm.controls.criteria;
    criteria.clear();
    criteria.push(this.createCriterion('UX', 40));
    criteria.push(this.createCriterion('Execução', 30));
    criteria.push(this.createCriterion('Originalidade', 30));
    this.creationForm.reset({ category: 'OTHER', minimumEvaluations: 3 });
  }
}
