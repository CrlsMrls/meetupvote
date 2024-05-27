import { Component, Signal, inject, signal } from '@angular/core';
import { BackendService } from '../../backend.service';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../../header.service';
import { Election, Question } from '../../models';
import { FirebaseService } from '../../firebase.service';

@Component({
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  providers: [BackendService],
  templateUrl: './admin-election.component.html',
})
export class AdminElectionComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  firebaseService: FirebaseService = inject(FirebaseService);
  #router: ActivatedRoute = inject(ActivatedRoute);
  election: Election | undefined;
  questions: Signal<Question[]> = signal([]);

  // set the header values and the path
  ngOnInit(): void {
    // get the election id from the route
    const electionId = this.#router.snapshot.paramMap.get('id');
    if (!electionId) {
      throw new Error('Election id is required');
    }
    this.election = this.backendService.getElectionById(electionId);
    this.questions = this.backendService.getQuestionsByElectionId(
      this.election.id
    );

    this.headerService.setHeaderText(this.election.title);
    this.headerService.setNavItems([
      {
        title: `ADMIN ${this.election.shortTitle}`,
        path: `/elections/${electionId}`,
      },
    ]);
  }

  printElection(): void {
    this.backendService.getFirestoreElections();
  }
}
