import { Component, Input, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = false;

  menuItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/quiz-selection', icon: 'quiz', label: 'Quiz Selection' },
    { path: '/history', icon: 'history', label: 'History' }
  ];
}
