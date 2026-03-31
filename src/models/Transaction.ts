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
    this._id = id ?? crypto.randomUUID();

    if (this._description.trim() === '') {
      throw new Error('A descrição não pode estar vazia.');
    }

    if (Number.isNaN(this._amount)) {
      throw new Error('Digite um número válido.');
    }

    if (this._amount <= 0) {
      throw new Error('O valor deve ser maior que zero.');
    }

    if (this._type !== 'income' && this._type !== 'expense') {
      throw new Error('Tipo inválido.');
    }

    if (!this._date || this._date.trim() === '') {
      throw new Error('A data deve ser informada.');
    }
  }

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
