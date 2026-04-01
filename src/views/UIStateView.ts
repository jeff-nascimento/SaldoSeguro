/**
 * View responsible for reflecting UI state changes in summary cards.
 *
 * Design decision:
 * Keeps visual state (active card) independent from business logic,
 * allowing the controller to dictate state without touching the DOM directly.
 */
export class UIStateView {
  updateActiveCard(type: 'income' | 'expense' | 'all'): void {
    // Maps UI elements to their corresponding state identifiers
    const cards = [
      { el: document.querySelector('.total-income'), name: 'income' },
      { el: document.querySelector('.total-expense'), name: 'expense' },
      { el: document.querySelector('.balance'), name: 'all' },
    ];

    cards.forEach((card) => {
      if (card.el) {
        // Toggles active state based on current selection
        card.el.classList.toggle('active-card', card.name === type);
      }
    });
  }
}
