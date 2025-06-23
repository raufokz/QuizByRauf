import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PrerenderResolver implements Resolve<any> {
  // Replace with actual categories from your backend or a config file
  private readonly categories = [
    'biology',
    'engineering',
    'computer science',
    'arts',
    'general knowledge',
    'mathematics',
    'chemistry',
    'pakistan studies',
    'islamic_studies',
    'current_affairs',
    'physics',
    'english',
  ];

  resolve() {
    return {
      params: this.categories.map(category => ({ category }))
    };
  }
}
