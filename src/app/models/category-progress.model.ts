// category-progress.model.ts
export interface CategoryProgress {
  totalAttempts: number;
  correctAnswers: number;
  lastAttemptDate?: string;
  highestScore?: number;
}
