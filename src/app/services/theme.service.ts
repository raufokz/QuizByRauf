import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      this.isDarkTheme.next(savedTheme === 'dark');
    } else if (prefersDark) {
      this.isDarkTheme.next(true);
    }

    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkTheme.next(!this.isDarkTheme.value);
    if (isPlatformBrowser(this.platformId)) {
      this.applyTheme();
    }
  }

  private applyTheme() {
    const theme = this.isDarkTheme.value ? 'dark' : 'light';
    localStorage.setItem('theme', theme);

    if (this.isDarkTheme.value) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
