import { Injectable } from '@angular/core';
import { ResultsService } from './results.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private resultsService: ResultsService) { }

  // Get overall performance
  getOverallPerformance(): any {
    const results = this.resultsService.getResults();
    if (results.length === 0) return null;

    const totalQuizzes = results.length;
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.score, 0);
    const averageScore = (totalCorrect / totalQuestions) * 100;

    return {
      totalQuizzes,
      totalQuestions,
      totalCorrect,
      averageScore
    };
  }

  // Get performance by category
  getPerformanceByCategory(): any[] {
    const results = this.resultsService.getResults();
    if (results.length === 0) return [];

    const categories = [...new Set(results.map(r => r.category))];
    return categories.map(category => {
      const categoryResults = results.filter(r => r.category === category);
      const totalQuizzes = categoryResults.length;
      const totalQuestions = categoryResults.reduce((sum, r) => sum + r.total, 0);
      const totalCorrect = categoryResults.reduce((sum, r) => sum + r.score, 0);
      const averageScore = (totalCorrect / totalQuestions) * 100;

      return {
        category,
        totalQuizzes,
        totalQuestions,
        totalCorrect,
        averageScore
      };
    });
  }

  // Get progress over time
  getProgressOverTime(): any[] {
    const results = this.resultsService.getResults();
    return results.map(r => ({
      date: new Date(r.date),
      score: (r.score / r.total) * 100,
      category: r.category
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Get weak areas
  getWeakAreas(count: number): string[] {
    const performanceByCategory = this.getPerformanceByCategory() || [];
    const sorted = [...performanceByCategory].sort((a, b) => a.averageScore - b.averageScore);
    return sorted.slice(0, count).map(c => c.category);
  }

  // Get weekly comparison
  getWeeklyComparison(): any {
    const results = this.resultsService.getResults();
    if (results.length < 2) return {
      quizzesChange: 0,
      scoreChange: 0,
      questionsChange: 0,
      masteredChange: 0
    };

    // Current week
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    const currentWeekResults = results.filter(r => new Date(r.date) >= currentWeekStart);

    // Previous week
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekResults = results.filter(r =>
      new Date(r.date) >= prevWeekStart && new Date(r.date) < currentWeekStart
    );

    // Calculate changes
    const quizzesChange = this.calculatePercentageChange(
      prevWeekResults.length,
      currentWeekResults.length
    );

    const scoreChange = this.calculatePercentageChange(
      this.getAverageScore(prevWeekResults),
      this.getAverageScore(currentWeekResults)
    );

    const questionsChange = this.calculatePercentageChange(
      prevWeekResults.reduce((sum, r) => sum + r.total, 0),
      currentWeekResults.reduce((sum, r) => sum + r.total, 0)
    );

    const masteredChange = this.calculatePercentageChange(
      this.getMasteredCategories(prevWeekResults),
      this.getMasteredCategories(currentWeekResults)
    );

    return {
      quizzesChange,
      scoreChange,
      questionsChange,
      masteredChange
    };
  }

  private calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return newValue === 0 ? 0 : 100;
    return Math.round(((newValue - oldValue) / oldValue) * 100);
  }

  private getAverageScore(results: any[]): number {
    if (results.length === 0) return 0;
    const totalQuestions = results.reduce((sum, r) => sum + r.total, 0);
    const totalCorrect = results.reduce((sum, r) => sum + r.score, 0);
    return (totalCorrect / totalQuestions) * 100;
  }

  private getMasteredCategories(results: any[]): number {
    const categories = [...new Set(results.map(r => r.category))];
    return categories.filter(category => {
      const categoryResults = results.filter(r => r.category === category);
      return this.getAverageScore(categoryResults) >= 80;
    }).length;
  }
}
