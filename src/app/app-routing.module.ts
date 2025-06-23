import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'quiz-selection',
        loadComponent: () => import('./pages/quiz-selection/quiz-selection.component').then(m => m.QuizSelectionComponent)
      },
      {
        path: 'quiz/:category',
        loadComponent: () => import('./pages/quiz/quiz.component').then(m => m.QuizComponent),
        data: { prerender: true }
      },
      {
        path: 'results',
        loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent)
      },
      {
        path: 'review',
        loadComponent: () => import('./pages/review/review.component').then(m => m.ReviewComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
