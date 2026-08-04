import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService, User } from '../auth/services/auth.service';
import { FormInputComponent } from '../auth/components/form-input/form-input.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = computed(() => this.auth.user());
  readonly showEditModal = signal(false);
  readonly showProjectModal = signal(false);
  readonly feedback = signal<string | null>(null);

  readonly profileForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    bio: [''],
    linkedin: [''],
    github: [''],
    website: [''],
    usertype: [this.user()?.usertype || 'USER', [Validators.required]],
    password: ['', [Validators.minLength(6)]],
  });

  readonly projectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    githublink: [''],
  });

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        if (params.get('edit') === 'true') {
          this.openEditModal();
        }

        if (params.get('addProject') === 'true') {
          this.showProjectModal.set(true);
        }
      });
  }

  openEditModal(): void {
    const user = this.user();
    if (!user) {
      return;
    }

    this.profileForm.patchValue({
      username: user.username,
      email: user.email,
      bio: user.bio || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      website: user.website || '',
      usertype: user.usertype || 'USER',
      password: '',
    });

    this.showEditModal.set(true);
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.feedback.set(null);
    const rawValues = this.profileForm.getRawValue();
    const updatedProfile: Partial<User> = {
      ...rawValues,
      usertype: rawValues.usertype as 'USER' | 'MODERATOR' | 'ADMIN',
    };

    this.auth.updateProfile(updatedProfile).subscribe({
      next: () => {
        this.feedback.set('Perfil atualizado com sucesso.');
        this.showEditModal.set(false);
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        this.feedback.set('Falha ao atualizar o perfil. Tente novamente.');
      }
    });
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  openProjectModal(): void {
    this.showProjectModal.set(true);
  }

  submitProject(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const projectData = this.projectForm.getRawValue();
    console.log('Projeto adicionado:', projectData);
    this.showProjectModal.set(false);
    this.projectForm.reset({ name: '', description: '', githublink: '' });
  }
}
