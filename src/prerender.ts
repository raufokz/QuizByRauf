// src/prerender.ts
import { categories } from './server';

export function getPrerenderParams() {
  return categories.map(category => ({
    params: { category }
  }));
}
