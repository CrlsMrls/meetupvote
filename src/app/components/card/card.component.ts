import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './card.component.html',
})
export class CardComponent {
  title = input.required<string>();
  subTitle = input<string>();
  link = input<string | null>();
}
