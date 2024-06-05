import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { ButtonComponent } from '../button/button.component';

export type formContent = {
  id?: string;
  title: string;
  description?: string;
};

@Component({
  selector: 'app-title-descr',
  standalone: true,
  imports: [FormsModule, CommonModule, CardComponent, ButtonComponent],
  templateUrl: './title-descr.component.html',
})
export class TitleDescrComponent {
  showId = input<boolean>(true);

  id = '';
  title = '';
  description = '';

  save = output<formContent>();

  onSave(): void {
    if (!this.title) {
      return;
    }

    this.save.emit({
      id: this.id,
      title: this.title,
      description: this.description,
    });

    this.id = '';
    this.title = '';
    this.description = '';
  }
}
