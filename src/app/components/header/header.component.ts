import { NgIf } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  title = input.required<string>();
  isDarkMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.isDarkMode = this.getThemePreference() || prefersDarkMode;
    this.setThemePreference(this.isDarkMode);
    this.changeBodyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.setThemePreference(this.isDarkMode);
    this.changeBodyTheme();
  }

  setThemePreference(isDarkMode: boolean): void {
    localStorage.setItem('themePreferenceDark', JSON.stringify(isDarkMode));
  }

  getThemePreference(): boolean {
    const storedPreference = localStorage.getItem('themePreferenceDark');
    console.log(storedPreference);
    return storedPreference ? JSON.parse(storedPreference) : false;
  }

  changeBodyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
