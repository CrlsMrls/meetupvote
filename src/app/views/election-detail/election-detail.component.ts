import { Component, Signal, inject, signal } from '@angular/core';
import { BackendService } from '../../backend.service';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { NavigationService } from '../../header.service';
import { Election, Question } from '../../models';

@Component({
  selector: 'app-election-detail',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  providers: [BackendService],
  templateUrl: './election-detail.component.html',
  styleUrl: './election-detail.component.css',
})
export class ElectionDetailComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
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
        title: this.election.shortTitle,
        path: `/elections/${electionId}`,
      },
    ]);
  }
}
