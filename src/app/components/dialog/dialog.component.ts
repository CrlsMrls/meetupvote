import { Component, input, model } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  open = model<boolean>(false);
  title = input<string>('');

  close(): void {
    this.open.set(false);
  }

  isOpen(): boolean {
    return this.open();
  }
}
