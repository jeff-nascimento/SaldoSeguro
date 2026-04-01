/**
 * View responsible for handling transaction form interactions and data extraction.
 *
 * Design decision:
 * Encapsulates all form-related logic (formatting, input handling, UI rules),
 * keeping the controller focused only on orchestration.
 */
import { Transaction } from '../models/Transaction';

export class TransactionFormView {
  private description = document.querySelector(
    '#description'
  ) as HTMLInputElement;
  private form = document.querySelector('form') as HTMLFormElement;
  private amount = document.querySelector('#amount') as HTMLInputElement;
  private type = document.querySelector('#type') as HTMLSelectElement;
  private category = document.querySelector('#category') as HTMLSelectElement;
  private date = document.querySelector('#date') as HTMLInputElement;

  constructor() {
    // Applies real-time formatting to amount input for better UX
    this.amount.addEventListener('input', this.handleAmountInput);
  }

  getFormData() {
    // Normalizes formatted currency string into a numeric value
    const rawValue = this.amount.value.replace(/\./g, '').replace(',', '.');

    return {
      description: this.description.value,
      amount: Number(rawValue) || 0,
      type: this.type.value,
      category: this.category.value,
      date: this.date.value,
    };
  }

  fillForm(transaction: Transaction): void {
    // Pre-fills form for editing, reusing same submission flow
    this.description.value = transaction.description;

    this.amount.value = transaction.amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    this.type.value = transaction.type;
    this.category.value = transaction.category;
    this.date.value = transaction.date;
  }

  clearForm(): void {
    // Uses native reset for simplicity and consistency
    this.form.reset();
  }

  bindSubmit(handler: () => void): void {
    // Prevents default form submission to keep SPA behavior
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      handler();
    });
  }

  handleAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Keeps only numeric characters for controlled formatting
    let value = input.value.replace(/\D/g, '');

    if (value === '') {
      input.value = '';
      return;
    }

    // Converts integer to decimal representation (cents → currency)
    const amount = Number(value) / 100;

    input.value = amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  excludeCategoryFromTransactionForms(): void {
    if (this.type && this.category) {
      const categoryGroup = this.category.parentElement as HTMLElement;

      /**
       * Dynamic UI rule:
       * Category is only relevant for expenses.
       * Hidden for income to avoid inconsistent data.
       */
      const updateVisibility = () => {
        if (this.type.value === 'income') {
          categoryGroup.style.display = 'none';
          this.category.value = '';
        } else {
          categoryGroup.style.display = 'block';

          // Ensures a valid category is always selected when visible
          if (this.category.value === '') {
            this.category.selectedIndex = 0;
          }
        }
      };

      // Keeps UI synchronized with user selection
      this.type.addEventListener('change', updateVisibility);

      updateVisibility();
    }
  }
}
