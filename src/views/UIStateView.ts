export class UIStateView {
  updateActiveCard(type: 'income' | 'expense' | 'all'): void {
    const cards = [
      { el: document.querySelector('.total-income'), name: 'income' },
      { el: document.querySelector('.total-expense'), name: 'expense' },
      { el: document.querySelector('.balance'), name: 'all' },
    ];

    cards.forEach((card) => {
      if (card.el) {
        card.el.classList.toggle('active-card', card.name === type);
      }
    });
  }
}
