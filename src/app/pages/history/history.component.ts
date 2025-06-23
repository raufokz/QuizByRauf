import { Component, OnInit } from '@angular/core';
import { ResultsService } from '../../services/results.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  quizHistory: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private resultsService: ResultsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    try {
      this.quizHistory = this.resultsService.getResults();
      this.loading = false;
    } catch (e) {
      this.error = 'Failed to load quiz history';
      this.loading = false;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  viewDetails(quiz: any): void {
    this.router.navigate(['/results'], { state: quiz });
  }
}
