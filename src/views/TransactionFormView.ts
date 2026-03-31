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
    this.amount.addEventListener('input', this.handleAmountInput);
  }

  getFormData() {
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
    this.form.reset();
  }

  bindSubmit(handler: () => void): void {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      handler();
    });
  }

  handleAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    if (value === '') {
      input.value = '';
      return;
    }

    const amount = Number(value) / 100;

    input.value = amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  excludeCategoryFromTransactionForms(): void {
    if (this.type && this.category) {
      const categoryGroup = this.category.parentElement as HTMLElement;

      const updateVisibility = () => {
        if (this.type.value === 'income') {
          categoryGroup.style.display = 'none';
          this.category.value = '';
        } else {
          categoryGroup.style.display = 'block';

          if (this.category.value === '') {
            this.category.selectedIndex = 0;
          }
        }
      };

      this.type.addEventListener('change', updateVisibility);
      updateVisibility();
    }
  }
}
