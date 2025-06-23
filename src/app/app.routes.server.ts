import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'quiz/:category',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return all categories you want to prerender
      return [
        { category: 'biology' },
        { category: 'engineering' },
        { category: 'computer-science' },
        { category: 'arts' },
        { category: 'general-knowledge' },
        { category: 'mathematics' },
        { category: 'chemistry' },
        { category: 'pakistan-studies' },
        { category: 'islamic-studies' },
        { category: 'current-affairs' },
        { category: 'physics' },
        { category: 'english' }
        // Add more categories as needed
      ];
    }
  },
  {
    path: 'home',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'quiz-selection',
    renderMode: RenderMode.Prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Server // Fallback to SSR for other routes
  }
];
