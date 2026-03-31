import { ThemeView } from '../views/ThemeView';
import { ThemeService, Theme } from '../services/ThemeService';

export class ThemeController {
  private themeView = new ThemeView();
  private themeService = new ThemeService();
  private toggleButton = document.querySelector('#theme-toggle');

  private isDark = false;

  constructor() {
    this.loadTheme();
    this.addEvents();
  }

  private addEvents(): void {
    this.toggleButton?.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  private toggleTheme(): void {
    this.isDark = !this.isDark;

    this.applyTheme();
    this.themeService.saveTheme(this.isDark ? 'dark' : 'light');
  }

  private loadTheme(): void {
    const theme: Theme = this.themeService.getTheme();
    this.isDark = theme === 'dark';

    this.applyTheme();
  }

  private applyTheme(): void {
    this.themeView.applyTheme(this.isDark);
  }
}
