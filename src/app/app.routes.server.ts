import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'post/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: ':slug',
    renderMode: RenderMode.Server
  }
];
