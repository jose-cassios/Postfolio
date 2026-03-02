import { Routes } from '@angular/router';
import path from 'path';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing')
        .then(m => m.Landing)
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./features/explore/explore')
        .then(m => m.Explore)
  },
  {
    path: 'competicoes',
    loadComponent: () =>
      import('./features/competitions/competitions')
        .then(m => m.Competitions)
  },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./features/about/about')
        .then(m => m.About)
  },

  {
    path: 'perfil/:username',
    loadComponent: () =>
      import('./features/profile/profile')
        .then(m => m.Profile)
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin')
        .then(m => m.Admin)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
  path: 'registro',
  loadComponent: () =>
    import('./features/auth/register/register')
    .then(m => m.Register),
  },

  {
    path: '**',
    redirectTo: ''
  }
];
