/**
 * Controller responsible for managing application theme (light/dark).
 *
 * Design decision:
 * Keeps theme persistence logic in the service and DOM manipulation in the view,
 * while the controller only coordinates interactions between them.
 */
import { ThemeView } from '../views/ThemeView';
import { ThemeService, Theme } from '../services/ThemeService';

export class ThemeController {
  private themeView = new ThemeView();
  private themeService = new ThemeService();
  private toggleButton = document.querySelector('#theme-toggle');

  // Tracks current theme state in memory for quick toggling
  private isDark = false;

  constructor() {
    // Initialize theme from persisted state before binding events
    this.loadTheme();
    this.addEvents();
  }

  private addEvents(): void {
    // UI event binding kept isolated to maintain clear structure
    this.toggleButton?.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  private toggleTheme(): void {
    // Toggle internal state first, then propagate changes
    this.isDark = !this.isDark;

    this.applyTheme();

    // Persist user preference to maintain consistency across sessions
    this.themeService.saveTheme(this.isDark ? 'dark' : 'light');
  }

  private loadTheme(): void {
    const theme: Theme = this.themeService.getTheme();

    // Sync internal state with persisted value
    this.isDark = theme === 'dark';

    this.applyTheme();
  }

  private applyTheme(): void {
    // Delegates DOM updates to the view layer
    this.themeView.applyTheme(this.isDark);
  }
}
