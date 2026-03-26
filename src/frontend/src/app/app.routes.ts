import { Routes } from '@angular/router';
import path from 'path';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component')
        .then(m => m.LandingComponent)
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./features/explore/explore.component')
        .then(m => m.ExploreComponent)
  },
  {
    path: 'competicoes',
    loadComponent: () =>
      import('./features/competitions/competitions.component')
        .then(m => m.CompetitionsComponent)
  },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./features/about/about.component')
        .then(m => m.AboutComponent)
  },

  {
    path: 'perfil/:username',
    loadComponent: () =>
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent)
  },

  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component')
        .then(m => m.AdminComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
  path: 'registro',
  loadComponent: () =>
    import('./features/auth/register/register.component')
    .then(m => m.RegisterComponent),
  },
  {
    path: 'projetos/:slug',
    loadComponent: () =>
      import('./features/project/project.component')
        .then(m => m.ProjectComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
