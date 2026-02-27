import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface User {
  name: string;
  avatarInitial: string;
  role?: 'admin' | 'user';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // (substituir por AuthService depois)
  private _isLogged = signal(false);

  user = signal<User | null>(null);

  isLogged = computed(() => this._isLogged());

  // Simulação de login
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
