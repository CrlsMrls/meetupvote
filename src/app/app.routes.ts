import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  PreloadAllModules,
  ResolveFn,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { environment } from '../environments/environment';

import { FirebaseService } from './services/firebase.service';
import { AdminBackendService } from './services/admin-backend.service';
import { ElectionComponent } from './views/admin/election/election.component';
import { NotFoundComponent } from './views/notfound/notfound.component';
import { VotersComponent } from './views/voters/voters.component';
import { ElectionListComponent } from './views/admin/election-list/election-list.component';
import { ResultsComponent } from './views/admin/results/results.component';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const adminGuardFunction: CanActivateFn = async (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> => {
  const firebaseService = inject(FirebaseService);
  if (!environment.production) {
    await wait(1000);
  }
  return firebaseService.admin();
};

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuardFunction],
    // resolve: { data: () => inject(AdminBackendService).loading },
    children: [
      {
        path: 'elections',
        component: ElectionListComponent,
      },
      { path: 'elections/:id', component: ElectionComponent },
      { path: 'results/:id', component: ResultsComponent },
    ],
  },
  {
    path: ':id',
    component: VotersComponent,
  },
  { path: '', redirectTo: '/admin/elections', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }, // The wildcard '**' matches any path
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
