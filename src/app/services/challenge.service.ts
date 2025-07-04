import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { QuizService } from './quiz.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  private challenges: any[] = [];
  private challengeProgress: any[] = [];
  private readonly isBrowser: boolean;

  constructor(
    private quizService: QuizService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeChallenges();
    this.loadProgress();
  }

  private initializeChallenges(): void {
    const categories = this.quizService.getCategories();
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const rewards = [
      '100 XP Points',
      'Bronze Badge',
      'Silver Badge',
      'Gold Badge',
      'Bonus Streak Day'
    ];

    // Create challenges for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      const questionCount = randomDifficulty === 'Easy' ? 10 : randomDifficulty === 'Medium' ? 15 : 20;
      const reward = rewards[Math.floor(Math.random() * rewards.length)];

      this.challenges.push({
        id: 'challenge-' + date.toISOString().split('T')[0],
        name: `${randomDifficulty} ${randomCategory} Challenge`,
        category: randomCategory,
        difficulty: randomDifficulty,
        questionCount: questionCount,
        reward: reward,
        expires: new Date(date.setHours(23, 59, 59, 999)),
        xp: randomDifficulty === 'Easy' ? 100 : randomDifficulty === 'Medium' ? 150 : 200
      });
    }
  }

  getTodaysChallenge(): any {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.challenges.find(challenge => {
      const challengeDate = new Date(challenge.expires);
      challengeDate.setHours(0, 0, 0, 0);
      return challengeDate.getTime() === today.getTime();
    });
  }

  getUpcomingChallenges(limit: number = 3): any[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.challenges
      .filter(challenge => {
        const challengeDate = new Date(challenge.expires);
        return challengeDate.getTime() > today.getTime();
      })
      .slice(0, limit);
  }

  getChallengeProgress(challengeId: string): any {
    return this.challengeProgress.find(p => p.challengeId === challengeId);
  }

  saveChallengeProgress(challengeId: string, completed: number): void {
    const existing = this.getChallengeProgress(challengeId);

    if (existing) {
      existing.completed = completed;
      existing.updatedAt = new Date();
    } else {
      this.challengeProgress.push({
        challengeId,
        completed,
        updatedAt: new Date()
      });
    }

    this.saveProgress();
  }

  completeChallenge(challengeId: string): void {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (challenge) {
      this.saveChallengeProgress(challengeId, challenge.questionCount);
    }
  }

  getRecentCompletions(limit: number = 3): any[] {
    return this.challengeProgress
      .filter(p => p.completed > 0)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit)
      .map(p => {
        const challenge = this.challenges.find(c => c.id === p.challengeId);
        return {
          ...challenge,
          completed: p.completed,
          completedAt: p.updatedAt
        };
      });
  }

  private loadProgress(): void {
    if (!this.isBrowser) {
      this.challengeProgress = [];
      return;
    }

    const saved = localStorage.getItem('challengeProgress');
    if (saved) {
      try {
        this.challengeProgress = JSON.parse(saved);
        // Ensure dates are properly parsed
        this.challengeProgress.forEach(progress => {
          if (progress.updatedAt && typeof progress.updatedAt === 'string') {
            progress.updatedAt = new Date(progress.updatedAt);
          }
        });
      } catch (e) {
        console.error('Failed to parse challenge progress', e);
        this.challengeProgress = [];
      }
    }
  }

  private saveProgress(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem('challengeProgress', JSON.stringify(this.challengeProgress));
    } catch (e) {
      console.error('Failed to save challenge progress', e);
    }
  }

  resetChallenges(): void {
    this.challengeProgress = [];
    if (this.isBrowser) {
      localStorage.removeItem('challengeProgress');
    }
    this.initializeChallenges();
  }
}
