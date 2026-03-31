export type FilterData = {
  filterType?: 'income' | 'expense' | 'all';

  filterCategory?:
    | 'food'
    | 'transportation'
    | 'housing'
    | 'leisure'
    | 'health'
    | 'all';

  filterStartDate?: string;

  filterEndDate?: string;

  filterDescription?: string;
};
