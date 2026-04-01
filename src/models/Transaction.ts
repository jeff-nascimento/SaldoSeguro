/**
 * Domain model representing a financial transaction.
 *
 * Design decision:
 * This class encapsulates validation rules to guarantee that every instance
 * is always created in a valid state (fail-fast approach).
 */
export class Transaction {
  private _id: string;

  constructor(
    private _description: string,
    private _amount: number,
    private _type: string,
    private _category: string,
    private _date: string,
    id?: string
  ) {
    // Ensures each transaction has a unique identifier
    this._id = id ?? crypto.randomUUID();

    // Basic domain validations to prevent invalid data propagation
    if (this._description.trim() === '') {
      throw new Error('A descrição não pode estar vazia.');
    }

    if (Number.isNaN(this._amount)) {
      throw new Error('Digite um número válido.');
    }

    if (this._amount <= 0) {
      throw new Error('O valor deve ser maior que zero.');
    }

    // Restricts transaction type to known domain values
    if (this._type !== 'income' && this._type !== 'expense') {
      throw new Error('Tipo inválido.');
    }

    if (!this._date || this._date.trim() === '') {
      throw new Error('A data deve ser informada.');
    }
  }

  // Expose read-only access to preserve immutability from outside
  get description(): string {
    return this._description;
  }

  get amount(): number {
    return this._amount;
  }

  get type(): string {
    return this._type;
  }

  get category(): string {
    return this._category;
  }

  get date(): string {
    return this._date;
  }

  get id(): string {
    return this._id;
  }
}
