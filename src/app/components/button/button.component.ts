// class to implement a button component
// Usage:
//    <app-button [text]="'Primary action'" type="primary" (click)="onClick('primary')"></app-button>
//    <app-button [text]="'Secondary action'" (click)="onClick('secondary')"></app-button>

import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  type = input<'primary' | 'secondary' | undefined>();
  text = input.required<string>();
  click = output<void>();

  onClick(): void {
    this.click.emit();
  }

  get cssClasses(): string {
    const primary =
      'rounded-md bg-sky-600 dark:bg-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 dark:hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-500';
    const secondary =
      'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-0 hover:bg-gray-50';

    return this.type() === 'primary' ? primary : secondary;
  }
}
