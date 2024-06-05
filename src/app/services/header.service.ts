import { Injectable, signal } from '@angular/core';

export interface Navigation {
  title: string;
  path: string;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly #title = signal('MeetUp Vote App');
  readonly title = this.#title.asReadonly();

  readonly #navItems = signal<Navigation[]>([]);
  readonly navItems = this.#navItems.asReadonly();

  setHeaderText(text: string): void {
    this.#title.set(text);
  }

  setNavItems(items: Navigation[]): void {
    this.#navItems.update(() => items);
  }
}
