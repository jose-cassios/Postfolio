import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = computed(() => this.auth.user());
  readonly isLogged = computed(() => this.auth.isAuthenticated());

  goToProfile(): void {
    const username = this.user()?.username;
    if (username) {
      this.router.navigate(['/perfil', username]);
    }
  }

  goToAddProject(): void {
    const username = this.user()?.username;
    if (username) {
      this.router.navigate(['/perfil', username], { queryParams: { addProject: true } });
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
