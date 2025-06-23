export interface QuizQuestion {
  category: string;
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}
