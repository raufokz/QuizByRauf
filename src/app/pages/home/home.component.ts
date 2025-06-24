import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ResultsService } from '../../services/results.service';
import { AnalyticsService } from '../../services/analytics.service';
import { QuizService } from '../../services/quiz.service';
import { ThemeService } from '../../services/theme.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AchievementService } from '../../services/achievement.service';
import { ChallengeService } from '../../services/challenge.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  stats: any[] = [];
  progressTimeRange = '7';
  categoryPerformance: any[] = [];
  recentActivities: any[] = [];
  quickActions: any[] = [];
  categoryColors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];
  progressChart: Chart | null = null;
  categoryChart: Chart | null = null;

  randomQuestions: any[] = [];
  dailyChallenge: any = null;
  timeUntilRefresh: string = '';
  dailyStreak: number = 0;
  nextAchievement: string = '';
  private refreshInterval: any;
  private challengeCheckInterval: any;

  constructor(
    private resultsService: ResultsService,
    private analyticsService: AnalyticsService,
    private quizService: QuizService,
    private themeService: ThemeService,
    private router: Router,
    private achievementService: AchievementService,
    private challengeService: ChallengeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);
    }
  }

  ngOnInit(): void {
    this.loadStats();
    this.loadCategoryPerformance();
    this.loadRecentActivities();
    this.setupQuickActions();
    this.loadRandomQuestions();
    this.loadDailyChallenge();
    this.loadUserProgress();
    this.startChallengeTimer();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.createProgressChart();
        this.createCategoryChart();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.destroyCharts();
      this.clearIntervals();
    }
  }

  private destroyCharts(): void {
    try {
      if (this.progressChart) {
        this.progressChart.destroy();
        this.progressChart = null;
      }
      if (this.categoryChart) {
        this.categoryChart.destroy();
        this.categoryChart = null;
      }
    } catch (e) {
      console.warn('Error destroying charts:', e);
    }
  }

  private clearIntervals(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.challengeCheckInterval) {
      clearInterval(this.challengeCheckInterval);
    }
  }

  loadStats(): void {
    const performance = this.analyticsService.getOverallPerformance();
    const categories = this.quizService.getCategories();
    const weeklyComparison = this.analyticsService.getWeeklyComparison();

    this.stats = [
      {
        title: 'Total Quizzes Taken',
        value: performance?.totalQuizzes || 0,
        icon: 'calendar-check',
        color: 'primary',
        progress: weeklyComparison.quizzesChange
      },
      {
        title: 'Average Score',
        value: performance ? performance.averageScore.toFixed(1) + '%' : '0%',
        icon: 'chart-line',
        color: 'success',
        progress: weeklyComparison.scoreChange
      },
      {
        title: 'Questions Answered',
        value: performance?.totalQuestions || 0,
        icon: 'question-circle',
        color: 'info',
        progress: weeklyComparison.questionsChange
      },
      {
        title: 'Categories Mastered',
        value: categories.length > 0 ?
          Math.floor(categories.length * ((performance?.averageScore || 0) / 100)) + '/' + categories.length : '0/0',
        icon: 'award',
        color: 'warning',
        progress: weeklyComparison.masteredChange
      }
    ];
  }

  loadCategoryPerformance(): void {
    this.categoryPerformance = this.analyticsService.getPerformanceByCategory();
    if (this.categoryPerformance.length > 6) {
      this.categoryPerformance = this.categoryPerformance.slice(0, 6);
    }
  }

  loadRecentActivities(): void {
    const results = this.resultsService.getResults().slice(0, 5);
    this.recentActivities = results.map(result => ({
      date: result.date,
      message: `Scored ${result.score}/${result.total} in ${result.category} quiz`,
      icon: 'check-circle',
      color: (result.score / result.total) >= 0.7 ? 'success' :
             (result.score / result.total) >= 0.5 ? 'warning' : 'danger',
      xp: Math.round((result.score / result.total) * 100),
      category: result.category
    }));

    const challengeResults = this.challengeService.getRecentCompletions();
    challengeResults.forEach(challenge => {
      this.recentActivities.unshift({
        date: challenge.completedAt,
        message: `Completed ${challenge.name} challenge`,
        icon: 'trophy',
        color: 'warning',
        xp: challenge.reward.xp,
        category: challenge.category
      });
    });

    this.recentActivities.sort((a, b) => b.date - a.date);
    this.recentActivities = this.recentActivities.slice(0, 5);

    if (this.recentActivities.length === 0 && isPlatformBrowser(this.platformId)) {
      this.recentActivities = [
        {
          date: new Date(),
          message: 'Completed the Biology quiz',
          icon: 'check-circle',
          color: 'success',
          xp: 85,
          category: 'Biology'
        },
        {
          date: new Date(Date.now() - 86400000),
          message: 'Reviewed Chemistry questions',
          icon: 'book-open',
          color: 'info',
          xp: 30,
          category: 'Chemistry'
        }
      ];
    }
  }

  setupQuickActions(): void {
    const weakAreas = this.analyticsService.getWeakAreas(3);
    const weakAreaText = weakAreas.length > 0 ?
      `Focus on ${weakAreas.join(', ')}` : 'Identify areas to improve';

    this.quickActions = [
      {
        title: 'Quick Quiz',
        description: '10 random questions',
        icon: 'bolt',
        color: 'primary',
        link: '/quiz/random',
        badge: 'Fast'
      },
      {
        title: 'Review Weak Areas',
        description: weakAreaText,
        icon: 'book-medical',
        color: 'danger',
        link: '/review',
        badge: weakAreas.length > 0 ? weakAreas.length + ' areas' : ''
      },
      {
        title: 'Daily Challenge',
        description: 'Test your knowledge',
        icon: 'trophy',
        // color: 'warning',
        link: '/quiz/daily-challenge',
        badge: this.dailyChallenge?.completed ? 'In Progress' : ''
      },
      {
        title: 'Bookmarked Questions',
        description: 'Review saved items',
        icon: 'bookmark',
        // color: 'info',
        link: '/review?filter=bookmarked',
        badge: this.quizService.getBookmarkedCount() > 0 ?
          this.quizService.getBookmarkedCount() + ' saved' : ''
      }
    ];
  }

  loadRandomQuestions(count: number = 3): void {
    const allCategories = this.quizService.getCategories();
    this.randomQuestions = [];
    const selectedCategories = this.getRandomCategories(allCategories, count);

    selectedCategories.forEach(category => {
      const questions = this.quizService.getRandomQuestions(category, 1);
      if (questions.length > 0) {
        this.randomQuestions.push({
          ...questions[0],
          category
        });
      }
    });
  }

  loadDailyChallenge(): void {
    this.dailyChallenge = this.challengeService.getTodaysChallenge();
    if (this.dailyChallenge) {
      const progress = this.challengeService.getChallengeProgress(this.dailyChallenge.id);
      this.dailyChallenge.completed = progress ? progress.completed : 0;
    }
  }

  loadUserProgress(): void {
    this.dailyStreak = this.achievementService.getCurrentStreak();
    this.nextAchievement = this.achievementService.getNextAchievement();
  }

  refreshRandomQuestions(): void {
    this.loadRandomQuestions();
  }

  refreshDailyChallenge(): void {
    this.loadDailyChallenge();
  }

  startQuizFromQuestion(category: string): void {
    this.router.navigate(['/quiz', category], {
      queryParams: { count: 10, mode: 'practice' }
    });
  }

  startRandomQuiz(): void {
    this.router.navigate(['/quiz', 'random'], {
      queryParams: { count: 10, mode: 'quick' }
    });
  }

  startDailyChallenge(): void {
    if (this.dailyChallenge) {
      this.router.navigate(['/quiz', this.dailyChallenge.category], {
        queryParams: {
          count: this.dailyChallenge.questionCount,
          mode: 'challenge',
          challengeId: this.dailyChallenge.id
        }
      });
    }
  }

  viewChallengeLeaderboard(): void {
    this.router.navigate(['/leaderboard'], {
      queryParams: { type: 'daily-challenge' }
    });
  }

  startChallengeTimer(): void {
    this.updateTimeUntilRefresh();
    this.refreshInterval = setInterval(() => {
      this.updateTimeUntilRefresh();
    }, 60000);

    this.challengeCheckInterval = setInterval(() => {
      this.loadDailyChallenge();
    }, 300000);
  }

  updateTimeUntilRefresh(): void {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    this.timeUntilRefresh = `${hours}h ${minutes}m`;

    if (diff < 60000) {
      this.loadDailyChallenge();
      this.loadUserProgress();
    }
  }

  private getRandomCategories(categories: string[], count: number): string[] {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, categories.length));
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  createProgressChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Destroy existing chart first
    if (this.progressChart) {
      this.progressChart.destroy();
      this.progressChart = null;
    }

    const progressData = this.analyticsService.getProgressOverTime();
    let filteredData = progressData;

    if (this.progressTimeRange !== 'all') {
      const days = parseInt(this.progressTimeRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filteredData = progressData.filter(d => d.date >= cutoffDate);
    }

    const labels = filteredData.map(d => d.date.toLocaleDateString());
    const data = filteredData.map(d => d.score);

    const ctx = document.getElementById('progressChart') as HTMLCanvasElement;
    if (!ctx) return;

    try {
      this.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Score %',
            data: data,
            backgroundColor: 'rgba(78, 115, 223, 0.05)',
            borderColor: 'rgba(78, 115, 223, 1)',
            pointBackgroundColor: 'rgba(78, 115, 223, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.parsed.y.toFixed(1) + '%';
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating progress chart:', error);
    }
  }

  createCategoryChart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.categoryPerformance.length === 0) return;

    // Destroy existing chart first
    if (this.categoryChart) {
      this.categoryChart.destroy();
      this.categoryChart = null;
    }

    const labels = this.categoryPerformance.map(c => c.category);
    const data = this.categoryPerformance.map(c => c.averageScore);
    const backgroundColors = this.categoryPerformance.map((_, i) =>
      `rgba(${this.getColorRgb(this.categoryColors[i % this.categoryColors.length])}, 0.8)`
    );
    const borderColors = this.categoryPerformance.map((_, i) =>
      `rgba(${this.getColorRgb(this.categoryColors[i % this.categoryColors.length])}, 1)`
    );

    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    try {
      this.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + (context.raw as number).toFixed(1) + '%';
                }
              }
            }
          },
          cutout: '70%'
        }
      });
    } catch (error) {
      console.error('Error creating category chart:', error);
    }
  }

  updateProgressChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createProgressChart();
    }
  }

  private getColorRgb(color: string): string {
    const colors: {[key: string]: string} = {
      'primary': '78, 115, 223',
      'success': '28, 200, 138',
      'info': '54, 185, 204',
      'warning': '246, 194, 62',
      'danger': '231, 74, 59',
      'secondary': '133, 135, 150'
    };
    return colors[color] || '78, 115, 223';
  }
}
