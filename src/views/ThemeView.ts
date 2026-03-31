export class ThemeView {
  private body = document.body;
  private labelTheme = document.querySelector(
    '.toggle-text'
  ) as HTMLSpanElement;

  applyTheme(isDark: boolean): void {
    this.body.classList.toggle('dark', isDark);
    this.updateThemeLabel(isDark);
  }

  private updateThemeLabel(isDark: boolean): void {
    if (!this.labelTheme) return;
    this.labelTheme.innerHTML = isDark ? 'Modo escuro' : 'Modo claro';
  }
}
