import { Injectable } from '@angular/core';
import questionsData from '../../assets/questions.json';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private questions: any[] = questionsData;
  private quizResults: any[] = [];
  private quizDuration: number = 0;
 private currentQuizResults: any[] = [];
   private bookmarkedQuestions: number[] = [];
  constructor() { }

  // Get all unique categories
  // Get all questions
  getAllQuestions(): any[] {
    return this.questions;
  }

  getRandomQuestions(category: string, count: number): any[] {
    const categoryQuestions = this.getQuestionsByCategory(category);

    if (count >= categoryQuestions.length) {
      return [...categoryQuestions];
    }

    const shuffled = [...categoryQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Get questions by multiple categories
  getQuestionsByCategories(categories: string[]): any[] {
    return this.questions.filter(q => categories.includes(q.category));
  }


   getCategories(): string[] {
    return [...new Set(this.questions.map(q => q.category))];
  }

  getQuestionsByCategory(category: string): any[] {
    return this.questions.filter(q =>
      q.category.toLowerCase() === category.toLowerCase()
    );
  }



  getQuestionCountByCategory(category: string): number {
    return this.questions.filter(q => q.category === category).length;
  }

  setQuizResults(results: any[]): void {
    this.currentQuizResults = results;
  }

  getQuizResults(): any[] {
    return this.currentQuizResults;
  }

  setQuizDuration(duration: number): void {
    this.quizDuration = duration;
  }

  getQuizDuration(): number {
    return this.quizDuration;
  }

  // Bookmark management
  toggleBookmark(questionId: number): void {
    const index = this.bookmarkedQuestions.indexOf(questionId);
    if (index === -1) {
      this.bookmarkedQuestions.push(questionId);
    } else {
      this.bookmarkedQuestions.splice(index, 1);
    }
    this.saveBookmarks();
  }

  isBookmarked(questionId: number): boolean {
    return this.bookmarkedQuestions.includes(questionId);
  }

  getBookmarkedQuestions(): any[] {
    return this.questions.filter(q => this.bookmarkedQuestions.includes(q.id));
  }

  getBookmarkedCount(): number {
    return this.bookmarkedQuestions.length;
  }
// Add this method to your QuizService
getRandomQuestionsFromAll(count: number): any[] {
  if (count >= this.questions.length) {
    return [...this.questions];
  }

  const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
  private loadBookmarks(): void {
    const saved = localStorage.getItem('bookmarkedQuestions');
    if (saved) {
      try {
        this.bookmarkedQuestions = JSON.parse(saved);
      } catch (e) {
        this.bookmarkedQuestions = [];
      }
    }
  }

  private saveBookmarks(): void {
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(this.bookmarkedQuestions));
  }
}
