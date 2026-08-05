import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth-guard';

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
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin.component')
        .then(m => m.AdminComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'auth/registro',
    loadComponent: () =>
      import('./features/auth/components/register/register.component')
        .then(m => m.RegisterComponent)
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
