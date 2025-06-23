import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-selection',
  standalone: false,
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss']
})
export class QuizSelectionComponent implements OnInit {
  categories: string[] = [];
  popularCategories: string[] = ['computer science', 'general knowledge', 'biology'];
  selectedQuestionCount = 10;
  questionCountOptions = [5, 10, 15, 20, 25, 30];
  difficulty = 'mixed';
  enableTimer = false;
  loading = true;
  maxQuestions = 0;

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    setTimeout(() => {
      try {
        const categories = this.quizService.getCategories();
        this.categories = categories;
        this.maxQuestions = Math.max(...categories.map(cat => this.getQuestionCount(cat)));
        this.loading = false;
      } catch {
        this.loading = false;
      }
    }, 1000); // Simulate loading delay
  }

  getQuestionCount(category: string): number {
    return this.quizService.getQuestionCountByCategory(category);
  }

  isPopular(category: string): boolean {
    return this.popularCategories.includes(category.toLowerCase());
  }

  startQuiz(category: string): void {
    if (this.getQuestionCount(category) >= this.selectedQuestionCount) {
      this.router.navigate(['/quiz', category], {
        queryParams: {
          count: this.selectedQuestionCount,
          difficulty: this.difficulty,
          timer: this.enableTimer
        }
      });
    }
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
      'physics': 'bi bi-atom',
      'english': 'bi bi-translate'
    };
    return icons[category.toLowerCase()] || 'bi bi-question-circle';
  }
}
