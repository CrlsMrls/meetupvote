import { Component, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../../services/backend.service';
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
import { DialogComponent } from '../../../components/dialog/dialog.component';
import { Election, Question } from '../../../models';

@Component({
  selector: 'app-election',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    CommonModule,
    TitleDescrComponent,
    DialogComponent,
  ],
  providers: [BackendService],
  templateUrl: './election.component.html',
})
export class ElectionComponent {
  adminBackendService: AdminBackendService = inject(AdminBackendService);
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  firebaseService = inject(FirebaseService);
  #activeRoute: ActivatedRoute = inject(ActivatedRoute);
  #router: Router = inject(Router);

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

  viewElection() {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    this.#router.navigate([electionId]);
  }

  onSave(form: formContent): void {
    this.dialog().open.set(false);

    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    if (!electionId) {
      throw new Error('Election id is required');
    }

    const question: Question = {
      electionId,
      title: form.title,
      description: form.description || '',
      answers: ['GitHub Copilot', 'Gemini Code Assistant', 'Both', 'None'],
      votes: [],
    };

    this.adminBackendService.addQuestion(question);
  }
}
