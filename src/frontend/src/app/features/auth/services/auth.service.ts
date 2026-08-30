import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { map, of, tap, throwError, switchMap } from 'rxjs';
import { UserType } from '../../profile/profile.models';

export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  contactEmail?: string;
  availableForHire?: boolean;
  achievements?: Array<{ competitionId: string; competitionName: string; rank: number }>;
  usertype: UserType;
  profilePhoto?: string;
  coverPhoto?: string;
  token?: string;
}

interface LoginResponse {
  msg: string;
  token: string;
}

interface ProfileResponse {
  msg: string;
  data: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private readonly currentUser = signal<User | null>(
    this.loadUserFromStorage()
  );

  readonly user = computed(() => this.currentUser());

  constructor(private api: ApiService) {
    if (isPlatformBrowser(this.platformId) && this.getToken()) {
      this.fetchProfile().subscribe({
        error: (error) => {
          console.error('Falha ao carregar perfil a partir do token:', error);
          this.logout();
        },
      });
    }
  }

  login(email: string, password: string) {
    const payload = {
      email,
      password,
    };

    return this.api.post<LoginResponse>('user/login', payload).pipe(
      tap(response => this.setToken(response.token)),
      switchMap(() => this.fetchProfile()),
      tap(user => {
        console.log('Login bem-sucedido:', user);
      })
    );
  }

  private fetchProfile() {
    const token = this.getToken();

    if (!token) {
      return throwError(() => new Error('NOT_AUTHENTICATED'));
    }

    return this.api.post<ProfileResponse>(
      'user/profile',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).pipe(
      map(response => response.data),
      tap(user => this.setCurrentUser(user))
    );
  }

  private getToken(): string | null {
    const current = this.currentUser();
    if (current?.token) {
      return current.token;
    }

    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }

    return null;
  }

  private setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }

    const current = this.currentUser();
    if (current) {
      this.currentUser.set({ ...current, token });
    }
  }

  register(userData: Partial<User>) {
    const newUser: User = {
      username: userData.username || '',
      email: userData.email || '',
      password: userData.password,
      usertype: userData.usertype || 'USER',
      bio: userData.bio,
      linkedin: userData.linkedin,
      github: userData.github,
      website: userData.website,
      contactEmail: userData.contactEmail,
      availableForHire: userData.availableForHire,
    };

    return this.api.post<{ msg: string; userDto: User }>('user', newUser).pipe(
      switchMap(() => this.login(newUser.email, newUser.password!))
    );
  }

  updateProfile(userData: Partial<User>) {
    const current = this.currentUser();

    if (!current) {
      return throwError(() => new Error('NOT_AUTHENTICATED'));
    }

    const updatedUser = {
      ...current,
      ...userData,
      token: current.token,
    };

    const userId = current.id;

    if (!userId) {
      this.setCurrentUser(updatedUser);
      return of(updatedUser);
    }

    const token = this.getToken();
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    const payload = {
      username: userData.username,
      email: userData.email,
      bio: userData.bio,
      linkedin: userData.linkedin || null,
      github: userData.github || null,
      website: userData.website || null,
      contactEmail: userData.contactEmail || null,
      availableForHire: userData.availableForHire ?? false,
    };

    return this.api.put<User>(`user/${userId}`, payload, { headers }).pipe(
      tap(user => this.setCurrentUser({ ...updatedUser, ...user }))
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    this.currentUser.set(null);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  authOptions(): { headers: Record<string, string> } {
    const token = this.getToken();
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  }

  private loadUserFromStorage(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const stored = localStorage.getItem('user');

    if (!stored) {
      return null;
    }

    try {
      const user = JSON.parse(stored) as User & { userType?: UserType };
      return {
        ...user,
        usertype: user.usertype ?? user.userType ?? 'USER',
      };
    } catch {
      return null;
    }
  }

  private setCurrentUser(user: User): void {
    const token = user.token || this.getToken() || undefined;
    const finalUser = token ? { ...user, token } : user;

    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        localStorage.setItem('token', token);
      }

      localStorage.setItem('user', JSON.stringify(finalUser));
    }

    this.currentUser.set(finalUser);
  }
}
