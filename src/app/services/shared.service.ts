// src/app/services/shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sidebarState = new BehaviorSubject<boolean>(false);
  sidebarState$ = this.sidebarState.asObservable();

  toggleSidebar(): void {
    this.sidebarState.next(!this.sidebarState.value);
  }

  openSidebar(): void {
    this.sidebarState.next(true);
  }

  closeSidebar(): void {
    this.sidebarState.next(false);
  }

  getSidebarState(): boolean {
    return this.sidebarState.value;
  }
}
