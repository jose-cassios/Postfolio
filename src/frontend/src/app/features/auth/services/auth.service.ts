import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    return this.api.get<any[]>('users', { email })
      .pipe(
        map(users => {
          const user = users.find(u => u.email === email && u.password === password);

          if (!user) {
            throw new Error('INVALID_CREDENTIALS');
          }

          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Login bem-sucedido:', user);
          return user;
        })
      );
  }

  register(userData: any) {
    const newUser = {
      ...userData,
      token: `fake-jwt-token-${Math.random().toString(36).substring(7)}`
    };

    return this.api.post<any>('user', newUser).pipe(
      map(user => {
        localStorage.setItem('token', user.token || newUser.token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Registro bem-sucedido:', user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}
