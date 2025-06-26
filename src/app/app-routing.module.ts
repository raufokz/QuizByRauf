import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { QuizSelectionComponent } from './pages/quiz-selection/quiz-selection.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ResultsComponent } from './pages/results/results.component';
import { ReviewComponent } from './pages/review/review.component';
import { HistoryComponent } from './pages/history/history.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: { animation: 'HomePage', title: 'Home' }
      },
      {
        path: 'quiz-selection',
        component: QuizSelectionComponent,
        data: { animation: 'QuizSelectionPage', title: 'Quiz Selection' }
      },
      {
        path: 'quiz/:category',
        component: QuizComponent,
        data: { animation: 'QuizPage', title: 'Quiz' }
      },
      {
        path: 'results',
        component: ResultsComponent,
        data: { animation: 'ResultsPage', title: 'Results' }
      },
      {
        path: 'review',
        component: ReviewComponent,
        data: { animation: 'ReviewPage', title: 'Review' }
      },
      {
        path: 'history',
        component: HistoryComponent,
        data: { animation: 'HistoryPage', title: 'History' }
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
