import { CommonModule } from '@angular/common';
import { Component, HostBinding, input } from '@angular/core';
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
  link = input<string>();
  // @HostBinding('class') class = 'w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4';
}
