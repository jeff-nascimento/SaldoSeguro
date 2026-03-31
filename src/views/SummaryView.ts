import { Formatter } from '../utils/Formatter';

export class SummaryView {
  private cardRevenue = document.querySelector(
    '.card-revenue'
  ) as HTMLSpanElement;
  private cardExpense = document.querySelector(
    '.card-expense'
  ) as HTMLSpanElement;
  private cardBalance = document.querySelector(
    '.card-balance'
  ) as HTMLSpanElement;

  updateSummary(income: number, expense: number, balance: number): void {
    this.cardRevenue.innerText = Formatter.currency(income);
    this.cardExpense.innerText = Formatter.currency(expense);
    this.cardBalance.innerText = Formatter.currency(balance);

    if (balance < 0) {
      this.cardBalance.classList.remove('positive');
      this.cardBalance.classList.add('negative');
    } else {
      this.cardBalance.classList.remove('negative');
      this.cardBalance.classList.add('positive');
    }
  }

  bindSummaryClicks(
    handler: (type: 'income' | 'expense' | 'all') => void
  ): void {
    const cardIncome = document.querySelector('.total-income');
    const cardExpense = document.querySelector('.total-expense');
    const cardBalance = document.querySelector('.balance');

    cardIncome?.addEventListener('click', () => handler('income'));
    cardExpense?.addEventListener('click', () => handler('expense')); // Agora sim!
    cardBalance?.addEventListener('click', () => handler('all'));
  }
}
