import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timeLeftSubject = new BehaviorSubject<number>(60);
  private timer: any;
  private isPaused = false;

  constructor() { }

  startTimer(initialTime: number): void {
    this.timeLeftSubject.next(initialTime);
    this.isPaused = false;

    this.timer = setInterval(() => {
      if (!this.isPaused) {
        const currentTime = this.timeLeftSubject.value;
        if (currentTime > 0) {
          this.timeLeftSubject.next(currentTime - 1);
        } else {
          this.stopTimer();
        }
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.isPaused = true;
  }

  resumeTimer(): void {
    this.isPaused = false;
  }

  stopTimer(): void {
    clearInterval(this.timer);
  }

  getTimeLeft(): Observable<number> {
    return this.timeLeftSubject.asObservable();
  }

  resetTimer(): void {
    this.stopTimer();
    this.timeLeftSubject.next(60);
  }
}
