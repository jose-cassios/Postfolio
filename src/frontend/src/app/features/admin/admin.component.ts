import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../auth/services/auth.service';

type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

interface ManagedUser {
  id: string;
  username: string;
  email: string;
  usertype: UserRole;
  active: boolean;
}

type ReputationRank = 'F' | 'F+' | 'E' | 'E+' | 'D' | 'D+' | 'C' | 'C+' | 'B' | 'B+' | 'A' | 'A+' | 'S' | 'SS';

interface ReputationRankConfig {
  rank: ReputationRank;
  requiredXp: number;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private readonly api = inject(ApiService);
  readonly auth = inject(AuthService);

  readonly users = signal<ManagedUser[]>([]);
  readonly loading = signal(true);
  readonly pendingUserId = signal<string | null>(null);
  readonly notice = signal('');
  readonly rankConfigOpen = signal(false);
  readonly rankConfigLoading = signal(false);
  readonly rankConfigSaving = signal(false);
  readonly rankConfigError = signal('');
  readonly selectedRoles: Record<string, UserRole> = {};
  readonly rankValues: Record<ReputationRank, number> = {
    F: 0, 'F+': 20, E: 50, 'E+': 100, D: 180, 'D+': 300, C: 500,
    'C+': 750, B: 1100, 'B+': 1550, A: 2100, 'A+': 2800, S: 3800, SS: 5000,
  };
  readonly ranks: readonly ReputationRank[] = [
    'F', 'F+', 'E', 'E+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'SS',
  ];
  readonly roles: ReadonlyArray<{ value: UserRole; label: string }> = [
    { value: 'USER', label: 'User' },
    { value: 'MODERATOR', label: 'Moderator' },
    { value: 'ADMIN', label: 'Admin' },
  ];
  readonly isAdmin = () => this.auth.user()?.usertype === 'ADMIN';

  ngOnInit() {
    if (this.isAdmin()) this.loadUsers();
    else this.loading.set(false);
  }

  loadUsers() {
    this.loading.set(true);
    this.notice.set('');
    this.api.get<ManagedUser[]>('user/admin/users', undefined, this.auth.authOptions())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => {
          this.users.set(users);
          users.forEach((user) => { this.selectedRoles[user.id] = user.usertype; });
        },
        error: (error) => this.notice.set(error?.error?.message || 'Não foi possível carregar os usuários.'),
      });
  }

  changeRole(user: ManagedUser) {
    const usertype = this.selectedRoles[user.id];
    if (!usertype || usertype === user.usertype || this.isCurrentUser(user) || this.pendingUserId()) return;

    this.updateUser(user.id, `user/admin/users/${user.id}/role`, { usertype }, 'Papel atualizado.');
  }

  toggleUser(user: ManagedUser) {
    if (this.isCurrentUser(user) || this.pendingUserId()) return;

    this.updateUser(
      user.id,
      `user/admin/users/${user.id}/status`,
      { active: !user.active },
      user.active ? 'Conta suspensa.' : 'Conta reativada.',
    );
  }

  isCurrentUser(user: ManagedUser) {
    return user.id === this.auth.user()?.id;
  }

  roleLabel(role: UserRole) {
    return this.roles.find((item) => item.value === role)?.label ?? role;
  }

  openRankConfig() {
    if (!this.isAdmin()) return;

    this.rankConfigOpen.set(true);
    this.rankConfigLoading.set(true);
    this.rankConfigError.set('');
    this.api.get<ReputationRankConfig[]>('user/admin/rank-config', undefined, this.auth.authOptions())
      .pipe(finalize(() => this.rankConfigLoading.set(false)))
      .subscribe({
        next: (config) => config.forEach((item) => { this.rankValues[item.rank] = item.requiredXp; }),
        error: (error) => this.rankConfigError.set(error?.error?.message || 'Não foi possível carregar a configuração de ranks.'),
      });
  }

  closeRankConfig() {
    if (!this.rankConfigSaving()) this.rankConfigOpen.set(false);
  }

  isRankConfigValid() {
    let previous = -1;
    for (const rank of this.ranks) {
      const value = Number(this.rankValues[rank]);
      if (!Number.isInteger(value) || value < 0 || (rank === 'F' && value !== 0) || value <= previous) {
        return false;
      }
      previous = value;
    }
    return true;
  }

  saveRankConfig() {
    if (this.rankConfigSaving()) return;
    if (!this.isRankConfigValid()) {
      this.rankConfigError.set('F deve ser 0 e cada rank seguinte precisa exigir um XP maior que o anterior.');
      return;
    }

    this.rankConfigSaving.set(true);
    this.rankConfigError.set('');
    const ranks = this.ranks.map((rank) => ({ rank, requiredXp: Number(this.rankValues[rank]) }));
    this.api.put<ReputationRankConfig[]>('user/admin/rank-config', { ranks }, this.auth.authOptions())
      .pipe(finalize(() => this.rankConfigSaving.set(false)))
      .subscribe({
        next: (config) => {
          config.forEach((item) => { this.rankValues[item.rank] = item.requiredXp; });
          this.rankConfigOpen.set(false);
          this.notice.set('Configuração de ranks atualizada. Os novos limites já estão em uso.');
        },
        error: (error) => this.rankConfigError.set(error?.error?.message || 'Não foi possível salvar a configuração de ranks.'),
      });
  }

  private updateUser(id: string, url: string, body: object, message: string) {
    this.pendingUserId.set(id);
    this.notice.set('');
    this.api.put(url, body, this.auth.authOptions())
      .pipe(finalize(() => this.pendingUserId.set(null)))
      .subscribe({
        next: () => {
          this.notice.set(message);
          this.loadUsers();
        },
        error: (error) => this.notice.set(error?.error?.message || 'Não foi possível atualizar o usuário.'),
      });
  }
}
