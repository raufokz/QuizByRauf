import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ResultsComponent } from './pages/results/results.component';
import { ReviewComponent } from './pages/review/review.component';
import { HistoryComponent } from './pages/history/history.component';
import { QuizSelectionComponent } from './pages/quiz-selection/quiz-selection.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { PrerenderResolver } from './resolvers/prerender.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'quiz-selection', component: QuizSelectionComponent },
      {
        path: 'quiz/:category',
        component: QuizComponent,
        data: { renderMode: 'prerender' },
        resolve: { prerender: PrerenderResolver }
      },
      { path: 'results', component: ResultsComponent },
      { path: 'review', component: ReviewComponent },
      { path: 'history', component: HistoryComponent },
    ]
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
