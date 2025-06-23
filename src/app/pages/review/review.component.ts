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

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.questions = this.quizService.getAllQuestions();
    this.filteredQuestions = [...this.questions];
    this.categories = this.quizService.getCategories();
  }

  filterQuestions(): void {
    if (this.selectedCategory === 'all') {
      this.filteredQuestions = [...this.questions];
    } else {
      this.filteredQuestions = this.questions.filter(
        q => q.category === this.selectedCategory
      );
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
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
    return colors[category.toLowerCase()] || 'secondary';
  }
}
