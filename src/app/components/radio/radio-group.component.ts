import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-group.component.html',
})
export class RadioGroupComponent {
  legend = input.required<string>();
  description = input<string>();
  options = input.required<string[]>();
  selected = output<number>();

  formId = Math.random().toString(36).substring(2);

  onClick(option: number): void {
    this.selected.emit(option);
  }
}
