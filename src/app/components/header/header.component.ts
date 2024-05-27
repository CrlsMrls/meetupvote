import { Component, OnInit, inject } from '@angular/core';
import { NavigationService } from '../../header.service';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '../../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public navigationService = inject(NavigationService);
  public firebaseService = inject(FirebaseService);
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
