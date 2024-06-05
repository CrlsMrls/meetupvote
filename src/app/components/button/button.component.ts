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
      'rounded-md bg-amber-500 dark:bg-amber-400 px-3 py-2 text-sm font-semibold text-gray-800 hover:text-gray-700 shadow-sm hover:bg-amber-400 dark:hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-500';
    const secondary =
      'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-0 hover:bg-gray-50';

    return this.type() === 'primary' ? primary : secondary;
  }
}
