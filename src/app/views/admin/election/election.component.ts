import { Component, computed, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BackendService } from '@services/backend.service';
import { NavigationService } from '@services/header.service';
import { FirebaseService } from '@services/firebase.service';
import { AdminBackendService } from '@services/admin-backend.service';
import { CardComponent } from '@components/card/card.component';
import { ButtonComponent } from '@components/button/button.component';
import {
  TitleDescrComponent,
  formContent,
} from '@components/form/title-descr.component';
import { DialogComponent } from '@components/dialog/dialog.component';
import { Question } from '@app/models';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    TitleDescrComponent,
    DialogComponent,
    CommonModule,
  ],
  templateUrl: './election.component.html',
})
export class ElectionComponent {
  protected firebaseService = inject(FirebaseService);
  protected adminBackendService: AdminBackendService =
    inject(AdminBackendService);
  protected backendService: BackendService = inject(BackendService);
  protected headerService: NavigationService = inject(NavigationService);
  #activeRoute: ActivatedRoute = inject(ActivatedRoute);
  #router: Router = inject(Router);

  isElectionClosed = computed(() => {
    const election = this.adminBackendService.election();
    return election?.state === 'closed';
  });

  dialog = viewChild.required<DialogComponent>('dialog');

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

  onViewElection(): void {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    this.#router.navigate([electionId]);
  }

  onUnselect() {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    if (!electionId) {
      throw new Error('Election id is required');
    }
    this.adminBackendService.updateActiveQuestion(electionId, null);
  }
  onCloseElection(): void {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    if (!electionId) {
      throw new Error('Vote id is required');
    }
    this.adminBackendService.updateActiveQuestion(electionId, null);
    this.adminBackendService.updateElectionState(electionId, 'closed');
  }

  onReopenElection(): void {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    if (!electionId) {
      throw new Error('Vote id is required');
    }
    this.adminBackendService.updateElectionState(electionId, 'voting');
  }

  onSave(form: formContent): void {
    this.dialog().open.set(false);

    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    if (!electionId) {
      throw new Error('Election id is required');
    }

    // possible answers are hardcoded for now
    const options: string[] = [
      'GitHub Copilot',
      'Gemini Code Assistant',
      'Both',
      'None',
    ];

    const question: Question = {
      electionId,
      title: form.title,
      description: form.description || '',
      options,
      votes: [],
    };

    this.adminBackendService.addQuestion(question);
  }

  onSelectQuestion(voteId: string | undefined): void {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    if (!voteId || !electionId) {
      throw new Error('Vote id is required');
    }
    this.adminBackendService.updateActiveQuestion(electionId, voteId);
  }
}
