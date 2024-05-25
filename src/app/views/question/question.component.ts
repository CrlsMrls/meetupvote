import { Component, Signal, inject, signal } from '@angular/core';
import { BackendService } from '../../backend.service';
import { NavigationService } from '../../header.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { Election, Question } from '../../models';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CardComponent, ButtonComponent],
  providers: [BackendService],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  #router: ActivatedRoute = inject(ActivatedRoute);
  election: Election | undefined;
  question: Signal<Question>;

  // set the header values and the path
  constructor() {
    // get the election id from the route
    const electionId = this.#router.snapshot.paramMap.get('id');
    const questionId = this.#router.snapshot.paramMap.get('qid');
    if (!electionId) {
      throw new Error('Election id is required');
    }
    if (!questionId) {
      throw new Error('Question id is required');
    }
    this.election = this.backendService.getElectionById(electionId);
    this.question = this.backendService.getQuestionById(questionId);

    this.headerService.setHeaderText(this.election.title);
    this.headerService.setNavItems([
      {
        title: this.election.shortTitle,
        path: `/elections/${electionId}`,
      },
      {
        title: this.question().title,
        path: `/elections/${electionId}`,
      },
    ]);
  }
}
