import { Component, HostListener } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LayoutComponent {
  isSidebarCollapsed = false;
  isDarkTheme = false;
  isMobile = false;

  constructor(
    private router: Router,
    private contexts: ChildrenOutletContexts,
    private themeService: ThemeService
  ) {
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Match your media query breakpoint
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebarOnMobile() {
    if (this.isMobile) {
      this.isSidebarCollapsed = false;
    }
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
