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
type ReputationAxis = 'CREATOR' | 'CONTRIBUTOR';

interface ReputationRankConfig {
  rank: ReputationRank;
  requiredXp: number;
}

interface ReputationEvent {
  id: string;
  type: string;
  axis: ReputationAxis;
  points: number;
  reason: string | null;
  createdAt: string;
  reversal: { id: string; points: number; reason: string | null; createdAt: string } | null;
  reversible: boolean;
}

interface ReputationHistory {
  totals: { creatorXp: number; contributorXp: number };
  events: ReputationEvent[];
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
  readonly reputationHistoryOpen = signal(false);
  readonly reputationHistoryLoading = signal(false);
  readonly reputationMutationPending = signal(false);
  readonly reputationError = signal('');
  readonly selectedReputationUser = signal<ManagedUser | null>(null);
  readonly reputationHistory = signal<ReputationHistory | null>(null);
  readonly selectedRoles: Record<string, UserRole> = {};
  readonly reversalReasons: Record<string, string> = {};
  adjustmentAxis: ReputationAxis = 'CREATOR';
  adjustmentPoints: number | null = null;
  adjustmentReason = '';
  private adjustmentIdempotencyKey = this.newIdempotencyKey();
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

  openReputationHistory(user: ManagedUser) {
    if (!this.isAdmin()) return;

    this.rankConfigOpen.set(false);
    this.selectedReputationUser.set(user);
    this.reputationHistoryOpen.set(true);
    this.reputationHistoryLoading.set(true);
    this.reputationError.set('');
    this.reputationHistory.set(null);
    this.adjustmentAxis = 'CREATOR';
    this.adjustmentPoints = null;
    this.adjustmentReason = '';
    this.adjustmentIdempotencyKey = this.newIdempotencyKey();
    this.api.get<ReputationHistory>(`user/admin/users/${user.id}/reputation-events`, undefined, this.auth.authOptions())
      .pipe(finalize(() => this.reputationHistoryLoading.set(false)))
      .subscribe({
        next: (history) => this.reputationHistory.set(history),
        error: (error) => this.reputationError.set(error?.error?.message || 'Não foi possível carregar o histórico de reputação.'),
      });
  }

  closeReputationHistory() {
    if (!this.reputationMutationPending()) this.reputationHistoryOpen.set(false);
  }

  applyReputationAdjustment() {
    const user = this.selectedReputationUser();
    const points = Number(this.adjustmentPoints);
    const reason = this.adjustmentReason.trim();
    if (!user || this.reputationMutationPending()) return;
    if (!Number.isInteger(points) || points === 0 || reason.length < 3) {
      this.reputationError.set('Informe um ajuste inteiro diferente de zero e um motivo com pelo menos 3 caracteres.');
      return;
    }

    this.reputationMutationPending.set(true);
    this.reputationError.set('');
    this.api.post<ReputationHistory>(
      `user/admin/users/${user.id}/reputation-adjustments`,
      {
        axis: this.adjustmentAxis,
        points,
        reason,
        idempotencyKey: this.adjustmentIdempotencyKey,
      },
      this.auth.authOptions(),
    ).pipe(finalize(() => this.reputationMutationPending.set(false))).subscribe({
      next: (history) => {
        this.reputationHistory.set(history);
        this.adjustmentPoints = null;
        this.adjustmentReason = '';
        this.adjustmentIdempotencyKey = this.newIdempotencyKey();
        this.notice.set('Ajuste de reputação aplicado.');
      },
      error: (error) => this.reputationError.set(error?.error?.message || 'Não foi possível aplicar o ajuste.'),
    });
  }

  reverseReputationEvent(event: ReputationEvent) {
    const reason = this.reversalReasons[event.id]?.trim();
    if (!event.reversible || !reason || this.reputationMutationPending()) return;

    this.reputationMutationPending.set(true);
    this.reputationError.set('');
    this.api.post<ReputationHistory>(
      `user/admin/reputation-events/${event.id}/reversal`,
      { reason },
      this.auth.authOptions(),
    ).pipe(finalize(() => this.reputationMutationPending.set(false))).subscribe({
      next: (history) => {
        this.reputationHistory.set(history);
        delete this.reversalReasons[event.id];
        this.notice.set('XP de origem revertido com evento compensatório.');
      },
      error: (error) => this.reputationError.set(error?.error?.message || 'Não foi possível reverter este evento.'),
    });
  }

  reputationEventLabel(type: string) {
    return ({
      PROJECT_PUBLISHED: 'Projeto publicado',
      PROJECT_VERSION_PUBLISHED: 'Nova versão publicada',
      EVENT_PARTICIPATION: 'Participação em evento',
      EVENT_FIRST_PLACE: '1º lugar em evento',
      EVENT_SECOND_PLACE: '2º lugar em evento',
      EVENT_THIRD_PLACE: '3º lugar em evento',
      POSTMARK_SENT: 'Postmark enviado',
      POSTMARK_USEFUL: 'Postmark útil',
      POSTMARK_APPLIED: 'Postmark aplicado',
      POSTMARK_CREDITED_IN_VERSION: 'Postmark creditado em versão',
      EVENT_PROJECT_EVALUATED: 'Projeto avaliado em evento',
      ADMIN_ADJUSTMENT: 'Ajuste administrativo',
    } as Record<string, string>)[type] ?? type;
  }

  xpLabel(points: number) {
    return `${points > 0 ? '+' : ''}${points} XP`;
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

  private newIdempotencyKey() {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `admin-adjustment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
