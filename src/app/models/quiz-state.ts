import { QuizQuestion } from './quiz-question';

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  selectedCategory: string;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  shuffledQuestions: QuizQuestion[];
  inReviewMode: boolean;
}

interface UserAnswer {
  questionIndex: number;
  question: QuizQuestion;
  selectedOption: number;
  isCorrect: boolean;
}
