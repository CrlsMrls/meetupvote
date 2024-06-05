import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from '../../services/header.service';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  protected navigationService = inject(NavigationService);
  protected firebaseService = inject(FirebaseService);

  isDarkMode: boolean = false;

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
