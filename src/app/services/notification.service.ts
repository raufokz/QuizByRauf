import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title?: string): void {
    this.toastr.success(message, title);
  }

  showError(message: string, title?: string): void {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title?: string): void {
    this.toastr.info(message, title);
  }

  showWarning(message: string, title?: string): void {
    this.toastr.warning(message, title);
  }

  // Custom quiz notifications
  showQuizComplete(score: number, total: number): void {
    const percentage = (score / total) * 100;
    let message = `You scored ${score}/${total} (${percentage.toFixed(1)}%)`;

    if (percentage >= 80) {
      this.toastr.success(message, 'Excellent!');
    } else if (percentage >= 60) {
      this.toastr.info(message, 'Good Job!');
    } else if (percentage >= 40) {
      this.toastr.warning(message, 'Keep Practicing');
    } else {
      this.toastr.error(message, 'Try Again');
    }
  }
}
