import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendService } from '../../services/backend.service';
import { NavigationService } from '../../services/header.service';
import { CardComponent } from '../../components/card/card.component';
import { ButtonComponent } from '../../components/button/button.component';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { RadioGroupComponent } from '../../components/radio/radio-group.component';
import { ButtonGroupComponent } from '../../components/button-group/button-group.component';
import { Vote } from '../../models';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    CommonModule,
    RadioGroupComponent,
    ButtonGroupComponent,
  ],
  providers: [BackendService],
  templateUrl: './voters.component.html',
})
export class VotersComponent {
  backendService: BackendService = inject(BackendService);
  headerService: NavigationService = inject(NavigationService);
  firebaseService = inject(FirebaseService);
  #activeRoute: ActivatedRoute = inject(ActivatedRoute);

  weights = ['0', '1', '2', '3', '4', '5'];

  selectedOption: number | undefined;
  selectedImportance: number | undefined;

  hasVoted = computed(() => {
    const question = this.backendService.question();
    if (!question) {
      return false;
    }
    const checkVoted = (vote: Vote) =>
      vote.voter === this.firebaseService.user()?.uid;

    return question.votes.some(checkVoted);
  });

  constructor() {
    this.#loadElection();
  }

  async #loadElection() {
    const electionId = this.#activeRoute.snapshot.paramMap.get('id');
    const election = await this.backendService.loadElectionById(electionId);
    this.headerService.setHeaderText(election?.title || 'Election');
  }

  onOptionSelected(option: number) {
    this.selectedOption = option;
  }

  onImportanceSelected(importance: number) {
    this.selectedImportance = importance;
  }

  async onSubmitVote() {
    const votedOption = this.selectedOption;
    const weight = this.selectedImportance;

    if (votedOption === undefined || weight === undefined) {
      return;
    }

    const questionId = this.backendService.question()?.id;
    if (!questionId) {
      throw new Error('Election not found');
    }
    const voter = this.firebaseService.user()?.uid;
    if (!voter) {
      throw new Error('User not authenticated');
    }

    // console.log(`Vote: ${votedOption}, weight: ${weight} by ${voter}`);

    const vote: Vote = {
      votedOption,
      weight,
      voter,
    };

    await this.backendService.vote(questionId, vote);
  }
}
