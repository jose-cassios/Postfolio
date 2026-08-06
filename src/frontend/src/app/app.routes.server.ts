import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'explorar',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'competicoes',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'sobre',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'perfil/:username',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/login',
    renderMode: RenderMode.Server
  },
  {
    path: 'auth/registro',
    renderMode: RenderMode.Server
  },
  {
    path: 'projetos/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
