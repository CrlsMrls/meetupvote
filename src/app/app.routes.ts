import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectionComponent } from './views/election/election.component';
import { ElectionDetailComponent } from './views/election-detail/election-detail.component';
import { QuestionComponent } from './views/question/question.component';

export const routes: Routes = [
  { path: 'elections', component: ElectionComponent },
  { path: 'elections/:id', component: ElectionDetailComponent },
  { path: 'elections/:id/question/:qid', component: QuestionComponent },
  { path: '', redirectTo: '/elections', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
