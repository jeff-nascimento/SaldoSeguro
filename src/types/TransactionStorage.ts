export type TransactionStorageDTO = {
  _id?: string;
  id?: string;
  _description: string;
  description?: string;
  _amount: number;
  amount?: number;
  _type: 'income' | 'expense';
  type?: string;
  _category: string;
  category?: string;
  _date: string;
  date?: string;
};
