import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { ResultsService } from '../../services/results.service';

@Component({
  selector: 'app-quiz',
  standalone: false,
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  questions: any[] = [];
  currentQuestionIndex = 0;
  selectedOption: number | null = null;
  showResult = false;
  score = 0;
  quizCompleted = false;
  category = '';
  answers: any[] = [];
  questionCount = 10;
  quizMode = 'practice';
  timeSpent = 0;
  timer: any;
  isAllQuestionsMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private resultsService: ResultsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.route.queryParams.subscribe(queryParams => {
        this.questionCount = +queryParams['count'] || 10;
        this.quizMode = queryParams['mode'] || 'practice';
        this.isAllQuestionsMode = queryParams['all'] === 'true';
        this.initializeQuiz();
      });
    });
  }

  initializeQuiz(): void {
    if (this.isAllQuestionsMode) {
      // Get questions from all categories
      this.questions = this.quizService.getRandomQuestionsFromAll(this.questionCount);
      this.category = 'All Questions'; // Set category name for display
    } else {
      // Get questions from specific category
      this.questions = this.quizService.getRandomQuestions(this.category, this.questionCount);
    }

    this.answers = this.questions.map(q => ({
      question: q,
      selected: null,
      isCorrect: false,
      timeSpent: 0
    }));

    this.startTimer();
  }

  startTimer(): void {
    this.timer = setInterval(() => {
      this.timeSpent++;
      this.answers[this.currentQuestionIndex].timeSpent++;
    }, 1000);
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  selectOption(index: number): void {
    if (!this.showResult) {
      this.selectedOption = index;
    }
  }

  nextQuestion(): void {
    if (this.selectedOption === null && !this.showResult) return;

    if (!this.showResult) {
      this.showResult = true;
      const isCorrect = this.selectedOption === this.currentQuestion.answer;
      this.answers[this.currentQuestionIndex] = {
        ...this.answers[this.currentQuestionIndex],
        selected: this.selectedOption,
        isCorrect
      };
      if (isCorrect) this.score++;

      if (this.quizMode === 'practice') {
        setTimeout(() => this.proceedToNext(), 500);
      }
    } else {
      this.proceedToNext();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedOption = null;
      this.showResult = false;
    }
  }

  proceedToNext(): void {
    this.showResult = false;
    this.selectedOption = null;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.questions.length) {
      this.completeQuiz();
    }
  }

  completeQuiz(): void {
    clearInterval(this.timer);
    this.quizCompleted = true;
    this.saveResults();
  }

  saveResults(): void {
    const result = {
      category: this.category,
      score: this.score,
      total: this.questions.length,
      answers: this.answers,
      date: new Date(),
      timeSpent: this.timeSpent,
      quizMode: this.quizMode,
      isAllQuestions: this.isAllQuestionsMode
    };

    this.quizService.setQuizResults(this.answers);
    this.resultsService.saveResult(result);
  }

  viewResults(): void {
    this.router.navigate(['/results']);
  }

  retakeQuiz(): void {
    if (this.isAllQuestionsMode) {
      this.router.navigate(['/quiz', 'all'], {
        queryParams: {
          count: this.questionCount,
          mode: this.quizMode,
          all: true
        }
      });
    } else {
      this.router.navigate(['/quiz', this.category], {
        queryParams: {
          count: this.questionCount,
          mode: this.quizMode
        }
      });
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

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
