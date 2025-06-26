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
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          animation: 'HomePage',
          title: 'Home - Quiz By Rauf',
          meta: { description: 'Free quizzes with no sign-up required!' }
        }
      },
      {
        path: 'quiz-selection',
        component: QuizSelectionComponent,
        data: {
          animation: 'QuizSelectionPage',
          title: 'Quiz Categories - Quiz By Rauf',
          meta: { description: 'Choose from many free quiz categories' }
        }
      },
      {
        path: 'quiz/:category',
        component: QuizComponent,
        data: {
          animation: 'QuizPage',
          title: 'Quiz - Quiz By Rauf',
          meta: { description: 'Test your knowledge now!' }
        }
      },
      {
        path: 'results',
        component: ResultsComponent,
        data: {
          animation: 'ResultsPage',
          title: 'Results - Quiz By Rauf',
          meta: { description: 'See your quiz results instantly' }
        }
      },
      {
        path: 'review',
        component: ReviewComponent,
        data: {
          animation: 'ReviewPage',
          title: 'Review Answers - Quiz By Rauf',
          meta: { description: 'Check correct answers and learn' }
        }
      },
      {
        path: 'history',
        component: HistoryComponent,
        data: {
          animation: 'HistoryPage',
          title: 'Quiz History - Quiz By Rauf',
          meta: { description: 'Your past quiz attempts' }
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    scrollPositionRestoration: 'enabled' // Better UX on navigation
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
