import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'quizByRaufUser';

  constructor() { }

  // Get current user
  getCurrentUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Set current user
  setCurrentUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Clear user data
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Get user progress
  getUserProgress(): any {
    const user = this.getCurrentUser();
    return user ? user.progress : null;
  }

  // Update user progress
  updateUserProgress(progress: any): void {
    const user = this.getCurrentUser();
    if (user) {
      user.progress = progress;
      this.setCurrentUser(user);
    }
  }
}
