import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review',
  standalone: false,
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  questions: any[] = [];
  filteredQuestions: any[] = [];
  categories: string[] = [];
  selectedCategory = 'all';
  categorySelected = false;
  isLoading = true;
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.isLoading = true;
    try {
      this.questions = this.quizService.getAllQuestions();
      this.filteredQuestions = [...this.questions];
      this.categories = this.quizService.getCategories();
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading questions:', error);
      this.isLoading = false;
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.categorySelected = true;
    this.currentPage = 1;
    this.filterQuestions();
  }

  backToCategories(): void {
    this.categorySelected = false;
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.filterQuestions();
  }

  filterQuestions(): void {
    if (!this.questions.length) return;

    // Filter by category
    if (this.selectedCategory === 'all') {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter(
        q => q.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      this.filteredQuestions = this.filteredQuestions.filter(q =>
        q.question.toLowerCase().includes(searchTermLower) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchTermLower)) ||
        q.options.some((opt: string) => opt.toLowerCase().includes(searchTermLower))
      );
    }
  }

  getPaginatedQuestions(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredQuestions.slice(startIndex, endIndex);
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getQuestionCount(category: string): number {
    if (category === 'all') return this.questions.length;
    return this.questions.filter(q => q.category.toLowerCase() === category.toLowerCase()).length;
  }

  getCategoryColor(category: string): string {
    const categoryMap: Record<string, string> = {
      'biology': 'success',
      'engineering': 'info',
      'computer science': 'primary',
      'arts': 'warning',
      'general knowledge': 'secondary',
      'mathematics': 'danger',
      'chemistry': 'primary',
      'pakistan studies': 'info',
      'islamic studies': 'success',
      'current affairs': 'warning',
      'physics': 'danger'
    };

    const lowerCategory = category.toLowerCase();
    return categoryMap[lowerCategory] || 'secondary';
  }

  getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'biology': 'fas fa-dna',
      'engineering': 'fas fa-cogs',
      'computer science': 'fas fa-laptop-code',
      'arts': 'fas fa-palette',
      'general knowledge': 'fas fa-brain',
      'mathematics': 'fas fa-square-root-alt',
      'chemistry': 'fas fa-flask',
      'pakistan studies': 'fas fa-flag',
      'islamic studies': 'fas fa-mosque',
      'current affairs': 'fas fa-newspaper',
      'physics': 'fas fa-atom'
    };

    const lowerCategory = category.toLowerCase();
    return iconMap[lowerCategory] || 'fas fa-book';
  }

  getToQuestionNumber(): number {
    const to = this.currentPage * this.pageSize;
    return Math.min(to, this.filteredQuestions.length);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredQuestions.length / this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}
