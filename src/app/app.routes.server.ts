import { RenderMode, ServerRoute } from '@angular/ssr';
import { categories } from '../server';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'quiz/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => categories.map((category: string) => ({ category }))
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];

