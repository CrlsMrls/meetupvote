import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NavigationService } from '../../services/header.service';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CardComponent, ButtonComponent, CommonModule],
  providers: [BackendService],
  templateUrl: './voters.component.html',
})
export class VotersComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  firebaseService = inject(FirebaseService);
  #activeRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.#loadElection();
  }

  async #loadElection() {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    const election = await this.backendService.loadElectionById(electionId);
    this.headerService.setHeaderText(election?.title || 'Election');
  }
}
