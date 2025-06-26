import { Component, HostListener, Inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'QuizByRauf';
  isDarkTheme = false;
  isSidebarOpen = false;
  isMobileView = false;
  private resizeListener?: () => void;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  ngOnInit() {
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window['adsbygoogle']) {
          setTimeout(() => {
            window['adsbygoogle'].push({});
          }, 200);
        }
      });
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileView();
      this.loadThemePreference();
      this.setupResizeListener();
    }

  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  private setupResizeListener() {
    this.resizeListener = () => this.checkMobileView();
    window.addEventListener('resize', this.resizeListener);
  }

  private checkMobileView() {
    if (isPlatformBrowser(this.platformId)) {
      // Check viewport width and user agent for better mobile detection
      const isSmallScreen = window.innerWidth < 960;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      this.isMobileView = isSmallScreen || isMobileUserAgent;
      this.isSidebarOpen = !this.isMobileView;
    }
  }

  private loadThemePreference() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkTheme = !this.isDarkTheme;
      localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
