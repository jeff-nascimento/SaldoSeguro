// services/TransactionService.ts
import { Transaction } from '../models/Transaction';
import { ExpenseSummary } from '../types/ExpenseSummary';
import { FilterData } from '../types/FilterData';
import { SortColumn, SortDirection } from '../types/Sorting';
import { TransactionStorageDTO } from '../types/TransactionStorage';
import { StorageService } from './StorageService';

export class TransactionService {
  private transactions: Transaction[] = [];
  private readonly STORAGE_KEY = 'transactions_data';

  constructor() {
    this.loadFromStorage();
  }

  calculate(transactions: Transaction[]): ExpenseSummary {
    const summary: ExpenseSummary = {
      food: 0,
      transportation: 0,
      housing: 0,
      leisure: 0,
      health: 0,
    };

    for (const transaction of transactions) {
      if (transaction.type === 'expense') {
        const category = transaction.category as keyof ExpenseSummary;

        if (summary[category] !== undefined) {
          summary[category] += transaction.amount;
        }
      }
    }
    return summary;
  }

  update(updatedTransaction: Transaction): void {
    this.transactions = this.transactions.map((transaction) =>
      transaction.id === updatedTransaction.id
        ? updatedTransaction
        : transaction
    );
    this.saveToStorage();
  }

  findById(id: string): Transaction | undefined {
    return this.transactions.find((transaction) => transaction.id === id);
  }

  add(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.saveToStorage();
  }

  getAll() {
    const transactionCopy = [...this.transactions];
    transactionCopy.sort((transactionA, transactionB) => {
      const dateA = new Date(transactionA.date).getTime();
      const dateB = new Date(transactionB.date).getTime();

      return dateB - dateA;
    });

    return transactionCopy;
  }

  delete(id: string): Transaction[] {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );
    this.saveToStorage();

    return this.transactions;
  }

  filterTransactions(
    transactions: Transaction[],
    filter: FilterData
  ): Transaction[] {
    return transactions.filter((transaction) => {
      const matchType =
        filter.filterType !== 'all'
          ? transaction.type === filter.filterType
          : true;

      const matchCategory =
        filter.filterCategory !== 'all'
          ? transaction.category === filter.filterCategory
          : true;

      const afterStart = filter.filterStartDate
        ? new Date(transaction.date) >= new Date(filter.filterStartDate)
        : true;

      const beforeEnd = filter.filterEndDate
        ? new Date(transaction.date) <= new Date(filter.filterEndDate)
        : true;

      const matchRangeDate = afterStart && beforeEnd;

      const filterText = filter.filterDescription?.toLowerCase() || '';

      const matchDescription =
        filterText !== ''
          ? transaction.description.toLowerCase().includes(filterText)
          : true;

      return matchType && matchCategory && matchRangeDate && matchDescription;
    });
  }

  private saveToStorage(): void {
    StorageService.save<Transaction[]>(this.STORAGE_KEY, this.transactions);
  }

  private loadFromStorage(): void {
    const data = StorageService.get<TransactionStorageDTO[]>(this.STORAGE_KEY);

    if (!data) return;

    this.transactions = data.map((item) => {
      return new Transaction(
        item._description || item.description || '',
        item._amount || item.amount || 0,
        (item._type || item.type) as 'income' | 'expense',
        item._category || item.category || '',
        item._date || item.date || '',
        item._id || item.id
      );
    });
  }

  sortTransactions(
    transactions: Transaction[],
    column: SortColumn | undefined,
    direction: SortDirection
  ): Transaction[] {
    if (!column) return transactions;

    const transactionCopy = [...transactions];

    return transactionCopy.sort((a, b) => {
      let comparison = 0;
      switch (column) {
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;

        case 'amount':
          comparison = a.amount - b.amount;
          break;

        case 'date':
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          comparison = dateA - dateB;
          break;
      }

      return direction === 'asc' ? comparison : comparison * -1;
    });
  }
}
