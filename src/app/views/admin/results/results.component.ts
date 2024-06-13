import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavigationService } from '@services/header.service';
import { AdminBackendService } from '@services/admin-backend.service';
import { CardComponent } from '@components/card/card.component';
import { ButtonComponent } from '@components/button/button.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { WeightsComponent } from '@components/weights/weights.component';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    DialogComponent,
    WeightsComponent,
    CommonModule,
  ],
  templateUrl: './results.component.html',
})
export class ResultsComponent {
  protected adminBackendService: AdminBackendService =
    inject(AdminBackendService);
  protected headerService: NavigationService = inject(NavigationService);
  #activeRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.#loadElection();
  }

  async #loadElection() {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    const election = await this.adminBackendService.loadElectionById(
      electionId
    );
    if (!election) {
      throw new Error('Election not found');
    }
    this.headerService.setHeaderText(election.title);
    this.headerService.setNavItems([
      { title: 'Elections', path: '/admin/elections' },
      { title: election.title, path: `/admin/elections/${election.id}` },
      { title: 'Results', path: `/admin/results/${election.id}` },
    ]);
  }

  ngOnInit(): void {
    this.headerService.setHeaderText('Elections');
    this.headerService.setNavItems([
      { title: 'Elections', path: '/admin/elections' },
    ]);
  }

  ngOnDestroy(): void {
    this.adminBackendService.unsubscribe();
  }
}
