import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../services/results.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  quizHistory: any[] = [];
  filteredHistory: any[] = [];
  loading = true;
  error: string | null = null;
  currentDisplayCount = 0;
  itemsPerLoad = 6;

  // Filter properties
  categories: string[] = [];
  selectedCategory = 'all';
  selectedMode = 'all';
  selectedDateRange = 'all';
  filterCount = 0;
  showMobileFilters = false;

  constructor(
    private resultsService: ResultsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.error = null;

    try {
      this.quizHistory = this.resultsService.getResults().sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Extract unique categories
      this.categories = [...new Set(this.quizHistory.map(q => q.category))];

      this.applyFilters();
    } catch (e) {
      console.error('Failed to load history:', e);
      this.error = 'Failed to load quiz history. Please try again later.';
    } finally {
      this.loading = false;
    }
  }

  refreshHistory(): void {
    this.loadHistory();
  }

  applyFilters(): void {
    this.filterCount = this.calculateFilterCount();
    this.filteredHistory = this.getFilteredItems().slice(0, this.itemsPerLoad);
    this.currentDisplayCount = this.filteredHistory.length;
    this.showMobileFilters = false;
  }

  calculateFilterCount(): number {
    let count = 0;
    if (this.selectedCategory !== 'all') count++;
    if (this.selectedMode !== 'all') count++;
    if (this.selectedDateRange !== 'all') count++;
    return count;
  }

  clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedMode = 'all';
    this.selectedDateRange = 'all';
    this.applyFilters();
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  loadMore(): void {
    const remainingItems = this.getFilteredItems().length - this.filteredHistory.length;
    const nextItems = Math.min(this.itemsPerLoad, remainingItems);

    if (nextItems > 0) {
      const startIndex = this.filteredHistory.length;
      const endIndex = startIndex + nextItems;
      const moreItems = this.getFilteredItems().slice(startIndex, endIndex);

      this.filteredHistory = [...this.filteredHistory, ...moreItems];
      this.currentDisplayCount = this.filteredHistory.length;
    }
  }

  getFilteredItems(): any[] {
    let filtered = [...this.quizHistory];
    const now = new Date();

    // Category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === this.selectedCategory);
    }

    // Mode filter
    if (this.selectedMode !== 'all') {
      filtered = filtered.filter(q => q.quizMode === this.selectedMode);
    }

    // Date filter
    if (this.selectedDateRange !== 'all') {
      filtered = filtered.filter(q => {
        const quizDate = new Date(q.date);

        switch (this.selectedDateRange) {
          case 'today':
            return quizDate.toDateString() === now.toDateString();
          case 'week':
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return quizDate >= startOfWeek;
          case 'month':
            return quizDate.getMonth() === now.getMonth() &&
                   quizDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    return filtered;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  viewDetails(quiz: any): void {
    this.router.navigate(['/results'], { state: quiz });
  }


  retryQuiz(quiz: any): void {
    if (quiz.isAllQuestions) {
      this.router.navigate(['/quiz', 'all'], {
        queryParams: {
          mode: quiz.quizMode,
          all: 'true'
        }
      });
    } else {
      this.router.navigate(['/quiz', quiz.category], {
        queryParams: {
          mode: quiz.quizMode
        }
      });
    }
  }
  getScoreColor(scoreRatio: number): string {
    if (scoreRatio >= 0.8) return 'var(--success-color)';
    if (scoreRatio >= 0.5) return 'var(--warning-color)';
    return 'var(--danger-color)';
  }

  getCategoryColor(category: string): string {
    const hash = category.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const colors = [
      'var(--chart-color-0)',
      'var(--chart-color-1)',
      'var(--chart-color-2)',
      'var(--chart-color-3)',
      'var(--chart-color-4)',
      'var(--chart-color-5)',
      'var(--chart-color-6)',
      'var(--chart-color-7)',
      'var(--chart-color-8)',
      'var(--chart-color-9)',
      'var(--chart-color-10)'
    ];

    return colors[Math.abs(hash) % colors.length];
  }

  isFeatured(quiz: any): boolean {
    return (quiz.score / quiz.total) > 0.8;
  }
}
