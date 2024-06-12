import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-group.component.html',
})
export class ButtonGroupComponent {
  legend = input.required<string>();
  description = input<string>();
  options = input.required<string[]>();
  selected = output<number>();

  formId = Math.random().toString(36).substring(2);

  selectedOption: number | null = null;

  onClick(option: number): void {
    this.selectedOption = option;
    this.selected.emit(option);
  }

  css(index: number): string {
    let css =
      'relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10 dark:ring-gray-700 justify-center grow';

    if (index === 0) {
      css += ' rounded-l-md';
    } else if (index === this.options().length - 1) {
      css += ' rounded-r-md';
    }
    if (index > 0) {
      css += ' -ml-px';
    }

    if (index === this.selectedOption) {
      css += ' bg-amber-600 text-amber-50 dark:bg-amber-400 dark:text-gray-800';
    } else {
      css += ' bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }

    return css;
  }
}
