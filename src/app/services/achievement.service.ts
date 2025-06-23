import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ResultsService } from './results.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
 private achievements = [
    { id: 'first-quiz', name: 'First Quiz', description: 'Complete your first quiz', earned: false },
    { id: 'perfect-score', name: 'Perfect Score', description: 'Score 100% on a quiz', earned: false },
    { id: '5-day-streak', name: '5 Day Streak', description: 'Complete quizzes for 5 consecutive days', earned: false },
    { id: 'category-master', name: 'Category Master', description: 'Score 90%+ in any category', earned: false },
    { id: 'quick-learner', name: 'Quick Learner', description: 'Complete 10 quizzes', earned: false }
  ];

  private userAchievements: any[] = [];
  private streak = 0;

  constructor(
    private resultsService: ResultsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAchievements();
      this.calculateStreak();
    }
  }

  // ... (keep all other methods the same)

  private loadAchievements(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('userAchievements');
      if (saved) {
        try {
          this.userAchievements = JSON.parse(saved);
          this.achievements.forEach(a => {
            a.earned = this.userAchievements.some(ua => ua.id === a.id);
          });
        } catch (e) {
          this.userAchievements = [];
        }
      }
    }
  }

  private saveAchievements(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userAchievements', JSON.stringify(this.userAchievements));
    }
  }
  getCurrentStreak(): number {
    return this.streak;
  }

  getNextAchievement(): string {
    const next = this.achievements.find(a => !a.earned);
    return next ? next.name : 'All achievements earned!';
  }

  getAchievementProgress(): any[] {
    return this.achievements.map(a => ({
      ...a,
      progress: this.userAchievements.some(ua => ua.id === a.id) ? 100 : 0
    }));
  }

  checkForNewAchievements(): void {
    const results = this.resultsService.getResults();

    // Check for first quiz
    if (results.length >= 1 && !this.achievements[0].earned) {
      this.unlockAchievement('first-quiz');
    }

    // Check for perfect score
    if (results.some(r => r.score === r.total) && !this.achievements[1].earned) {
      this.unlockAchievement('perfect-score');
    }

    // Check streak achievements
    if (this.streak >= 5 && !this.achievements[2].earned) {
      this.unlockAchievement('5-day-streak');
    }

    // Check category master
    const categoryPerformance = this.resultsService.getCategoryPerformance();
    if (Object.values(categoryPerformance).some((score: number) => score >= 90) && !this.achievements[3].earned) {
      this.unlockAchievement('category-master');
    }

    // Check quick learner
    if (results.length >= 10 && !this.achievements[4].earned) {
      this.unlockAchievement('quick-learner');
    }
  }

  private unlockAchievement(achievementId: string): void {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (achievement) {
      achievement.earned = true;
      this.userAchievements.push({
        id: achievementId,
        date: new Date(),
        name: achievement.name
      });
      this.saveAchievements();
    }
  }

  private calculateStreak(): void {
    const results = this.resultsService.getResults();
    if (results.length === 0) {
      this.streak = 0;
      return;
    }

    // Sort by date (newest first)
    results.sort((a, b) => b.date - a.date);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if there was activity today
    const lastDate = new Date(results[0].date);
    lastDate.setHours(0, 0, 0, 0);

    if (lastDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Check previous days
    for (let i = 0; i < results.length; i++) {
      const resultDate = new Date(results[i].date);
      resultDate.setHours(0, 0, 0, 0);

      while (currentDate > resultDate && streak > 0) {
        // Gap detected, streak broken
        this.streak = streak;
        return;
      }

      if (resultDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }

    this.streak = streak;
  }


}
