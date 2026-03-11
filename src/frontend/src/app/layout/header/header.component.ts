import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface User {
  name: string;
  avatarInitial: string;
  role?: 'admin' | 'user';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  // (substituir por AuthService depois)
  private _isLogged = signal(false);

  user = signal<User | null>(null);

  isLogged = computed(() => this._isLogged());

  login() {
    this._isLogged.set(true);
    this.user.set({
      name: 'Ana Silva',
      avatarInitial: 'A',
      role: 'admin'
    });
  }

  logout() {
    this._isLogged.set(false);
    this.user.set(null);
  }
}
