import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLogged = auth.isAuthenticated();

  if (!isLogged) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
