import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BackendService } from '@services/backend.service';
import { NavigationService } from '@services/header.service';
import { FirebaseService } from '@services/firebase.service';
import { CardComponent } from '@components/card/card.component';
import { ButtonComponent } from '@components/button/button.component';
import { RadioGroupComponent } from '@components/radio/radio-group.component';
import { ButtonGroupComponent } from '@components/button-group/button-group.component';
import { Question, Vote } from '@app/models';
import { WeightsComponent } from '@components/weights/weights.component';

@Component({
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    CommonModule,
    RadioGroupComponent,
    ButtonGroupComponent,
    WeightsComponent,
  ],
  providers: [],
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

  results = signal<Question[] | null>(null);

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
    effect(() => this.loadResults());
  }

  private async loadResults(): Promise<void> {
    const election = this.backendService.election();
    if (!election?.state || election.state !== 'closed') {
      return undefined;
    }
    if (!election.id) {
      throw new Error('Election cannot have an id');
    }
    const results = await this.backendService.loadQuestionsByElectionId(
      election.id
    );
    this.results.set(results);
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
