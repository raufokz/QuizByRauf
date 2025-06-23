import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'quiz/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const categories = ['computer science', 'general knowledge', 'biology'];
      return categories.map(category => ({ category }));
    }
  },
  {
    path: '**',
renderMode: RenderMode.Server

  }
];
