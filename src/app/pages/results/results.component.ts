import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { ResultsService } from '../../services/results.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: false,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  quizData: any = null;
  loading = true;
  error: string | null = null;
  currentTab = 'questions';

  constructor(
    private location: Location,
    private quizService: QuizService,
    private resultsService: ResultsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    try {
      const state = this.location.getState() as any;

      if (state?.score !== undefined) {
        this.quizData = {
          answers: state.answers,
          score: state.score,
          total: state.total,
          category: state.category || 'Mixed',
          timeSpent: state.timeSpent || 0
        };
      } else {
        const results = this.quizService.getQuizResults();
        if (results.length) {
          const score = results.filter(r => r.isCorrect).length;
          this.quizData = {
            answers: results,
            score,
            total: results.length,
            category: results[0]?.question?.category || 'Mixed',
            timeSpent: results.reduce((sum, q) => sum + q.timeSpent, 0)
          };
        } else {
          this.error = 'No quiz results found. Complete a quiz first.';
        }
      }
    } catch (e) {
      this.error = 'Error loading results';
    } finally {
      this.loading = false;
    }
  }

  getCategories(): string[] {
    if (!this.quizData?.answers) return [];
    return [...new Set(this.quizData.answers.map((a: any) => a.question.category))] as string[];
  }

  getCategoryScore(category: string): { correct: number, total: number } {
    const categoryAnswers = this.quizData.answers.filter((a: any) =>
      a.question.category === category
    );

    return {
      correct: categoryAnswers.filter((a: any) => a.isCorrect).length,
      total: categoryAnswers.length
    };
  }

  retakeQuiz(): void {
    if (this.quizData) {
      this.router.navigate(['/quiz', this.quizData.category]);
    }
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  changeTab(tab: string): void {
    this.currentTab = tab;
  }
}
