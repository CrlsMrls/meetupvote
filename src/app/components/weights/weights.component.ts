import { Component, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '@app/models';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-weights',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './weights.component.html',
})
export class WeightsComponent {
  question = input.required<Question>();

  copilot: number = 0;
  gemini: number = 0;
  copilotVotes: number = 0;
  geminiVotes: number = 0;
  bothVotes: number = 0;
  noneVotes: number = 0;

  weight = 0;
  weights: number[] = [0, 0, 0, 0, 0, 0];

  areTablesVisible = false;

  constructor() {
    effect(() => this.computeWeights());
  }

  computeWeights(): void {
    const votes = this.question().votes;

    if (votes.length <= 0) return;

    let sumWeights = 0;
    let totalVotes = 0;
    let answers = [0, 0, 0, 0]; // [copilot, gemini, both, none]
    let weights = [0, 0, 0, 0, 0, 0]; // [0, 1, 2, 3, 4, 5]

    votes.forEach((vote) => {
      answers[vote.votedOption]++;
      totalVotes += vote.votedOption === 2 ? 2 : 1;
      this.weights[vote.weight]++;
      sumWeights += vote.weight;
    });

    [this.copilotVotes, this.geminiVotes, this.bothVotes, this.noneVotes] =
      answers;

    this.copilot = (100 * (answers[0] + answers[2])) / totalVotes;
    this.gemini = (100 * (answers[1] + answers[2])) / totalVotes;

    this.copilot = parseFloat(this.copilot.toFixed(2));
    this.gemini = parseFloat(this.gemini.toFixed(2));

    // Average weight is based on 0-5 scale -> multiply by 20 to get 0-100 scale
    this.weight = (20 * sumWeights) / votes.length;
    this.weight = parseFloat(this.weight.toFixed(2));
  }

  toggleTables() {
    this.areTablesVisible = !this.areTablesVisible;
  }
}
