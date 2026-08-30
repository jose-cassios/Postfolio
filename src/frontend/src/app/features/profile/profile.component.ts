import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, forkJoin, of, Subscription } from 'rxjs';
import { AuthService, User } from '../auth/services/auth.service';
import {
  Portfolio,
  ProfileProject,
  ProfileUser,
  ProjectCategory,
} from './profile.models';
import { ProfileService } from './profile.service';

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

const PROFILE_URL_PATTERN = /^(https?:\/\/)?\S+$/i;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly profile = signal<ProfileUser | null>(null);
  readonly requestedUsername = signal('');
  readonly portfolio = signal<Portfolio | null>(null);
  readonly projects = signal<ProfileProject[]>([]);
  readonly isLoading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly projectsError = signal<string | null>(null);
  readonly feedback = signal<Feedback | null>(null);
  readonly showEditModal = signal(false);
  readonly isSavingProfile = signal(false);
  readonly deletingProjectId = signal<string | null>(null);

  private requestedEdit = false;
  private requestedProject = false;
  private profileLoad?: Subscription;

  readonly currentUser = computed(() => this.auth.user());
  readonly isOwnProfile = computed(() => {
    const profile = this.profile();
    const current = this.currentUser();
    return !!profile && !!current && profile.id === current.id;
  });
  readonly displayedProfile = computed<ProfileUser | null>(() => {
    const profile = this.profile();
    const current = this.currentUser();
    return this.isOwnProfile() && current
      ? { ...profile!, ...current, id: current.id ?? profile!.id }
      : profile;
  });
  readonly categories: ReadonlyArray<{
    value: ProjectCategory;
    label: string;
  }> = [
    { value: 'FULLSTACK', label: 'Full stack' },
    { value: 'FRONTEND', label: 'Front-end' },
    { value: 'BACKEND', label: 'Back-end' },
    { value: 'DESIGN', label: 'Design' },
    { value: 'MOBILE', label: 'Mobile' },
    { value: 'DATA_ANALYSIS', label: 'Análise de dados' },
    { value: 'OTHER', label: 'Outro' },
  ];

  readonly profileForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    bio: ['', [Validators.maxLength(200)]],
    linkedin: ['', [Validators.pattern(PROFILE_URL_PATTERN)]],
    github: ['', [Validators.pattern(PROFILE_URL_PATTERN)]],
    website: ['', [Validators.pattern(PROFILE_URL_PATTERN)]],
    availableForHire: [false],
  });

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const username = params.get('username');
        if (username) this.loadProfile(username);
      });

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.requestedEdit = params.get('edit') === 'true';
        this.requestedProject = params.get('addProject') === 'true';
        this.openRequestedModal();
      });
  }

  loadProfile(username: string): void {
    this.requestedUsername.set(username);
    this.profileLoad?.unsubscribe();
    this.isLoading.set(true);
    this.loadError.set(null);
    this.projectsError.set(null);
    this.feedback.set(null);

    this.profileLoad = forkJoin({
      profile: this.profileService.getProfile(username),
      portfolio: this.profileService.getPortfolio(username).pipe(
        catchError(() => of(null)),
      ),
      projects: this.profileService.getProjects(username).pipe(
        catchError((error) => {
          if (!(error instanceof HttpErrorResponse) || error.status !== 404) {
            this.projectsError.set('Não foi possível carregar os projetos.');
          }
          return of([] as ProfileProject[]);
        }),
      ),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: ({ profile, portfolio, projects }) => {
          this.profile.set(profile.data);
          this.portfolio.set(portfolio);
          this.projects.set(projects);
          this.openRequestedModal();
        },
        error: (error) => {
          this.profile.set(null);
          this.portfolio.set(null);
          this.projects.set([]);
          this.loadError.set(
            error instanceof HttpErrorResponse && error.status === 404
              ? 'Este perfil não foi encontrado.'
              : 'Não foi possível carregar este perfil. Tente novamente.',
          );
        },
      });
  }

  openEditModal(): void {
    const user = this.displayedProfile();
    if (!user || !this.isOwnProfile()) return;

    this.profileForm.reset({
      username: user.username,
      email: user.email ?? '',
      bio: user.bio ?? '',
      linkedin: user.linkedin ?? '',
      github: user.github ?? '',
      website: user.website ?? '',
      availableForHire: user.availableForHire ?? false,
    });
    this.feedback.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    if (!this.isSavingProfile()) this.showEditModal.set(false);
  }

  submitProfile(): void {
    if (this.profileForm.invalid || this.isSavingProfile()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const previousUsername = this.currentUser()?.username;
    const values = this.profileForm.getRawValue();
    const payload: Partial<User> = {
      ...values,
      linkedin: this.normalizeOptionalUrl(values.linkedin),
      github: this.normalizeOptionalUrl(values.github),
      website: this.normalizeOptionalUrl(values.website),
    };
    this.isSavingProfile.set(true);
    this.feedback.set(null);

    this.auth
      .updateProfile(payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSavingProfile.set(false)),
      )
      .subscribe({
        next: (user) => {
          this.profile.update((profile) =>
            profile ? { ...profile, ...user, id: user.id ?? profile.id } : profile,
          );
          this.showEditModal.set(false);
          this.feedback.set({
            type: 'success',
            message: 'Perfil atualizado com sucesso.',
          });

          if (previousUsername !== user.username) {
            this.router.navigate(['/perfil', user.username], {
              replaceUrl: true,
            });
          }
        },
        error: (error) => {
          this.feedback.set({
            type: 'error',
            message: this.errorMessage(error, 'Não foi possível atualizar o perfil.'),
          });
        },
      });
  }

  openCreateProjectEditor(): void {
    if (!this.isOwnProfile()) return;
    this.router.navigate(['/projetos/novo']);
  }

  openEditProjectEditor(project: ProfileProject): void {
    if (!this.isOwnProfile()) return;
    this.router.navigate(['/projetos', project.id, 'editar']);
  }

  deleteProject(project: ProfileProject): void {
    if (!this.isOwnProfile() || this.deletingProjectId()) return;
    if (typeof window !== 'undefined' && !window.confirm(`Remover “${project.name}”?`)) {
      return;
    }

    this.deletingProjectId.set(project.id);
    this.feedback.set(null);
    this.profileService
      .deleteProject(project.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.deletingProjectId.set(null)),
      )
      .subscribe({
        next: () => {
          this.projects.update((projects) =>
            projects.filter((item) => item.id !== project.id),
          );
          this.feedback.set({
            type: 'success',
            message: 'Projeto removido com sucesso.',
          });
        },
        error: (error) => {
          this.feedback.set({
            type: 'error',
            message: this.errorMessage(error, 'Não foi possível remover o projeto.'),
          });
        },
      });
  }

  categoryLabel(category: ProjectCategory): string {
    return this.categories.find((item) => item.value === category)?.label ?? category;
  }

  private openRequestedModal(): void {
    if (!this.isOwnProfile()) return;

    if (this.requestedEdit) {
      this.requestedEdit = false;
      this.openEditModal();
    }
    if (this.requestedProject) {
      this.requestedProject = false;
      this.openCreateProjectEditor();
    }
  }

  private errorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const validationMessage = error.error?.details?.issues?.[0]?.message;
      return validationMessage || error.error?.message || fallback;
    }
    return fallback;
  }

  private normalizeOptionalUrl(value: string): string | null {
    const trimmedValue = value.trim();
    if (!trimmedValue) return null;

    return /^https?:\/\//i.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;
  }
}
