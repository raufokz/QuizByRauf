import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';

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
  isLoading = true;

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

  filterQuestions(): void {
    if (!this.questions.length) return;

    if (this.selectedCategory === 'all') {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter(
        q => q.category.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
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
}
