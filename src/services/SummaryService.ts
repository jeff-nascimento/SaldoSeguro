import { Transaction } from '../models/Transaction';

export class SummaryService {
  getTotalIncome(transactions: Transaction[]): number {
    let total = 0;
    for (const i of transactions) {
      if (i.type === 'income') total += i.amount;
    }

    return total;
  }

  getTotalExpense(transactions: Transaction[]): number {
    let total = 0;
    for (const i of transactions) {
      if (i.type === 'expense') total += i.amount;
    }

    return total;
  }

  getBalance(transactions: Transaction[]): number {
    const income = this.getTotalIncome(transactions);
    const expense = this.getTotalExpense(transactions);
    const balance = income - expense;
    return balance;
  }

  calculateSummary(transactions: Transaction[]) {
    const income = this.getTotalIncome(transactions);
    const expense = this.getTotalExpense(transactions);
    const balance = this.getBalance(transactions);

    return { income, expense, balance };
  }
}
