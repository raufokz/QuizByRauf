import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Save quiz result to local storage
  saveResult(result: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const results = this.getResults();
      results.unshift({
        ...result,
        id: Date.now(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('quizResults', JSON.stringify(results));
    }
  }

  // Get all results from local storage
  getResults(): any[] {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('quizResults') || '[]');
    }
    return [];
  }

  // Get results by category
  getResultsByCategory(category: string): any[] {
    return this.getResults().filter(r =>
      r.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Clear all results
  clearResults(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('quizResults');
    }
  }

  // Get category performance
  getCategoryPerformance(): { [category: string]: number } {
    const results = this.getResults();
    if (results.length === 0) return {};

    const performance: { [category: string]: number } = {};
    const categories = [...new Set(results.map(r => r.category))];

    categories.forEach(category => {
      const categoryResults = results.filter(r => r.category === category);
      const totalQuestions = categoryResults.reduce((sum, r) => sum + r.total, 0);
      const totalCorrect = categoryResults.reduce((sum, r) => sum + r.score, 0);
      performance[category] = (totalCorrect / totalQuestions) * 100;
    });

    return performance;
  }

  // Get recent results
  getRecentResults(limit: number = 5): any[] {
    return this.getResults().slice(0, limit);
  }
}
