import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-quiz-selection',
  standalone: false,
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss']
})
export class QuizSelectionComponent implements OnInit {
  categories: string[] = [];
  filteredCategories: string[] = [];
  selectedQuestionCount = 10;
  questionCountOptions = [5, 10, 15, 20];
  searchQuery = '';
  sortOption = 'name';
  viewMode: 'grid' | 'list' = 'grid';
  totalQuestions = 0;
  bookmarkedCount = 0;
  maxQuestions = 0;
  isLoading = true;
  todaysChallenge: any = null;
  weakAreas: string[] = [];
  performanceStats: any = null;
showMobileFilters: boolean = false;
difficulty: string = 'mixed';
stats = [
    { value: 0, label: 'Quizzes' },
    { value: 0, label: 'Questions' },
    { value: 0, label: 'Players' }
  ];
  constructor(
    private quizService: QuizService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private challengeService: ChallengeService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(): Promise<void> {
    try {
      this.isLoading = true;
      await this.loadCategories();
      this.loadBookmarkedCount();
      this.loadTodaysChallenge();
      this.loadPerformanceStats();
      this.loadWeakAreas();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading = false;
    }
  }
  clearSearch(): void {
    this.searchQuery = '';
    this.filterCategories();
  }
  async loadCategories(): Promise<void> {
    this.categories = await this.quizService.getCategories();
    this.filteredCategories = [...this.categories];
    this.calculateTotalQuestions();
    this.calculateMaxQuestions();
    this.sortCategories();
  }

  loadBookmarkedCount(): void {
    this.bookmarkedCount = this.quizService.getBookmarkedCount();
  }

  loadTodaysChallenge(): void {
    this.todaysChallenge = this.challengeService.getTodaysChallenge();
  }

  loadPerformanceStats(): void {
    this.performanceStats = this.analyticsService.getOverallPerformance();
  }

  loadWeakAreas(): void {
    this.weakAreas = this.analyticsService.getWeakAreas(3);
  }

  calculateTotalQuestions(): void {
    this.totalQuestions = this.quizService.getAllQuestions().length;
  }

  calculateMaxQuestions(): void {
    this.maxQuestions = Math.max(
      ...this.categories.map(cat => this.getQuestionCount(cat))
    );
  }

  getQuestionCount(category: string): number {
    return this.quizService.getQuestionCountByCategory(category);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'biology': 'bi bi-leaf',
      'engineering': 'bi bi-cpu',
      'computer science': 'bi bi-code-slash',
      'arts': 'bi bi-palette',
      'general knowledge': 'bi bi-globe',
      'mathematics': 'bi bi-calculator',
      'chemistry': 'bi bi-flask',
      'pakistan studies': 'bi bi-flag',
      'islamic_studies': 'bi bi-moon-stars',
      'current_affairs': 'bi bi-newspaper',
      'physics': 'bi bi-lightning-charge',
      'english': 'bi bi-translate'
    };
    return icons[category.toLowerCase()] || 'bi bi-question-circle';
  }

  filterCategories(): void {
    if (!this.searchQuery) {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.sortCategories();
  }

  sortCategories(): void {
    switch (this.sortOption) {
      case 'name':
        this.filteredCategories.sort((a, b) => a.localeCompare(b));
        break;
      case 'nameDesc':
        this.filteredCategories.sort((a, b) => b.localeCompare(a));
        break;
      case 'count':
        this.filteredCategories.sort((a, b) =>
          this.getQuestionCount(a) - this.getQuestionCount(b)
        );
        break;
      case 'countDesc':
        this.filteredCategories.sort((a, b) =>
          this.getQuestionCount(b) - this.getQuestionCount(a)
        );
        break;
      default:
        this.filteredCategories.sort((a, b) => a.localeCompare(b));
    }
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.sortOption = 'name';
    this.filterCategories();
  }

  startQuiz(category: string): void {
    if (this.getQuestionCount(category) >= this.selectedQuestionCount) {
      this.router.navigate(['/quiz', category], {
        queryParams: {
          count: this.selectedQuestionCount
        }
      });
    }
  }

  startChallenge(): void {
    if (this.todaysChallenge) {
      this.router.navigate(['/quiz', this.todaysChallenge.category], {
        queryParams: {
          count: this.todaysChallenge.questionCount,
          challenge: true
        }
      });
    }
  }

  isWeakArea(category: string): boolean {
    return this.weakAreas.includes(category);
  }

  getChallengeProgress(): number {
    if (!this.todaysChallenge) return 0;
    const progress = this.challengeService.getChallengeProgress(this.todaysChallenge.id);
    return progress ? (progress.completed / this.todaysChallenge.questionCount) * 100 : 0;
  }
}
