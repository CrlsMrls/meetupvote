import { Component } from '@angular/core';

@Component({
  selector: 'app-404',
  template: `
    <div
      class="flex items-center justify-center fixed bottom-0 left-0 right-0 p-4"
    >
      <div class="w-full max-w-md">
        <img src="404.gif" alt="Not found" class="w-full h-auto" />
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
