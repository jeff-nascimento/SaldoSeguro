export type Theme = 'dark' | 'light';

export class ThemeService {
  getTheme(): Theme {
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
  }

  saveTheme(theme: Theme): void {
    localStorage.setItem('theme', theme);
  }
}
