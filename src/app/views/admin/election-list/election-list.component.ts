import { Component, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NavigationService } from '../../../services/header.service';
import { CardComponent } from '../../../components/card/card.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { FirebaseService } from '../../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { AdminBackendService } from '../../../services/admin-backend.service';
import {
  TitleDescrComponent,
  formContent,
} from '../../../components/form/title-descr.component';
import { Election } from '../../../models';
import { DialogComponent } from '../../../components/dialog/dialog.component';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    CommonModule,
    TitleDescrComponent,
    DialogComponent,
  ],
  providers: [],
  templateUrl: './election-list.component.html',
})
export class ElectionListComponent {
  firebaseService = inject(FirebaseService);
  adminBackendService = inject(AdminBackendService);
  headerService: NavigationService = inject(NavigationService);
  #router: Router = inject(Router);

  dialog = viewChild.required<DialogComponent>('dialog');

  constructor() {
    this.adminBackendService.loadElections();
    this.headerService.setHeaderText('Elections');
    this.headerService.setNavItems([
      { title: 'Elections', path: '/admin/elections' },
    ]);
  }

  ngOnDestroy(): void {
    this.adminBackendService.unsubscribe();
  }

  // navigate to the election details page
  navigateToElectionDetails(electionId: string): void {
    this.#router.navigate(['/admin/elections', electionId]);
  }

  electionUrlIfLoggedIn(electionId: string): string | null {
    return this.firebaseService.admin()
      ? `/admin/elections/${electionId}`
      : null;
  }

  onSave(form: formContent): void {
    this.dialog().open.set(false);

    const election: Election = {
      id: form.id,
      title: form.title,
      description: form.description || '',
      visibility: 'public',
      state: 'open',
    };

    this.adminBackendService.createElection(election);
  }
}
