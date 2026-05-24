import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    const payload = {
      email,
      password,
    };

    return this.api.post<any>('user/login', payload)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.token);
          console.log('Login bem-sucedido:', response);

          return response;
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
