import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() isDarkTheme = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onToggleTheme() {
    this.toggleTheme.emit();
  }
}
