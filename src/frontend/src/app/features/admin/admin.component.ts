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
  readonly selectedRoles: Record<string, UserRole> = {};
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
