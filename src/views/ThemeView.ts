/**
 * View responsible for applying and reflecting the current theme (light/dark).
 *
 * Design decision:
 * Centralizes all DOM updates related to theming,
 * keeping theme logic out of controllers and services.
 */
export class ThemeView {
  private body = document.body;

  private labelTheme = document.querySelector(
    '.toggle-text'
  ) as HTMLSpanElement;

  applyTheme(isDark: boolean): void {
    // Applies global theme using a CSS class on <body>
    this.body.classList.toggle('dark', isDark);

    this.updateThemeLabel(isDark);
  }

  private updateThemeLabel(isDark: boolean): void {
    if (!this.labelTheme) return;

    // Provides immediate UI feedback about the current theme
    this.labelTheme.innerHTML = isDark ? 'Modo escuro' : 'Modo claro';
  }
}
