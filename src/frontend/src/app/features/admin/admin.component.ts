import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Competition, CompetitionPayload, CompetitionService } from '../competitions/competition.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CompetitionService);
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  readonly competitions = signal<Competition[]>([]);
  readonly saving = signal(false);
  readonly notice = signal('');
  readonly users = signal<Array<{ id: string; username: string; email: string; usertype: string; active: boolean }>>([]);
  readonly isAdmin = () => this.auth.user()?.usertype === 'ADMIN';
  readonly canModerate = () => ['ADMIN', 'MODERATOR'].includes(this.auth.user()?.usertype ?? '');
  readonly categories = ['FULLSTACK', 'FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DATA_ANALYSIS', 'OTHER'];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    category: ['OTHER', Validators.required],
    registrationStartsAt: ['', Validators.required],
    registrationEndsAt: ['', Validators.required],
    votingStartsAt: ['', Validators.required],
    votingEndsAt: ['', Validators.required],
    resultsAt: ['', Validators.required],
  });

  ngOnInit() { this.load(); this.loadUsers(); }

  load() { this.service.list().subscribe({ next: (items) => this.competitions.set(items) }); }

  loadUsers() {
    if (!this.canModerate()) return;
    this.api.get<Array<{ id: string; username: string; email: string; usertype: string; active: boolean }>>(
      'user/admin/users',
      undefined,
      this.auth.authOptions(),
    ).subscribe({ next: (users) => this.users.set(users) });
  }

  toggleUser(user: { id: string; active: boolean }) {
    this.api.put<{ id: string; active: boolean }>(
      `user/admin/users/${user.id}/status`,
      { active: !user.active },
      this.auth.authOptions(),
    ).subscribe({
      next: () => { this.notice.set(user.active ? 'Conta suspensa.' : 'Conta reativada.'); this.loadUsers(); },
      error: (error) => this.notice.set(error?.error?.message || 'Não foi possível moderar a conta.'),
    });
  }

  submit() {
    if (this.form.invalid || this.saving()) { this.form.markAllAsTouched(); return; }
    const values = this.form.getRawValue();
    const payload = Object.fromEntries(Object.entries(values).map(([key, value]) =>
      key.endsWith('At') ? [key, new Date(value).toISOString()] : [key, value],
    )) as unknown as CompetitionPayload;
    this.saving.set(true);
    this.notice.set('');
    this.service.create(payload).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => { this.notice.set('Competição criada com sucesso.'); this.form.reset({ category: 'OTHER' }); this.load(); },
      error: (error) => this.notice.set(error?.error?.message || 'Não foi possível criar a competição.'),
    });
  }
}
