/**
 * Main controller responsible for orchestrating interactions
 * between Views (UI) and Services (business logic).
 *
 * Design decision:
 * This controller delegates responsibilities to services and views
 * to avoid becoming a God Class, acting mainly as a coordinator.
 */
import { FilterView } from '../views/FilterView';
import { ModalView } from '../views/ModalView';
import { NotificationView } from '../views/NotificationView';
import { SummaryView } from '../views/SummaryView';
import { TransactionFormView } from '../views/TransactionFormView';
import { TransactionTableView } from '../views/TransactionTableViews';
import { SummaryService } from '../services/SummaryService';
import { ChartView } from '../views/ChartView';
import { FilterData } from '../types/FilterData';
import { FilterStorageService } from '../services/FilterStorageService';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { SortColumn } from '../types/Sorting';
import { SortDirection } from '../types/Sorting';
import { UIStateView } from '../views/UIStateView';

export class Controller {
  private transactionService = new TransactionService();
  private summary = new SummaryService();

  private formView = new TransactionFormView();
  private tableView = new TransactionTableView();
  private filterView = new FilterView();
  private summaryView = new SummaryView();
  private modalView = new ModalView();
  private notification = new NotificationView();
  private chartView = new ChartView();
  private uiState = new UIStateView();

  // Tracks current UI interaction state (editing, sorting, deletion flow)
  private editingId?: string;
  private sortColumn?: SortColumn;
  private sortDirection: SortDirection = 'asc';
  private idPendingDeletion?: string;

  constructor() {
    // Bind UI events to controller handlers (centralized event orchestration)
    this.formView.bindSubmit(this.handleSubmit);

    this.tableView.bindDelete(this.handleDelete);

    this.tableView.bindEdit(this.handleEdit);

    this.formView.excludeCategoryFromTransactionForms();
    console.log(this.formView.getFormData());

    this.filterView.excludeCategoryFromFilters();

    this.filterView.bindFilterChange(this.handleFilter);

    this.tableView.bindSort(this.handleSort);

    this.filterView.bindClearFilters(this.handleClearFilters);

    this.modalView.bindConfirmDelete(this.handleConfirmDelete);

    this.modalView.bindCancelDelete(this.handleCancelDelete);

    this.summaryView.bindSummaryClicks(this.handleSummaryClick);

    // Restore persisted filters to keep user context between sessions
    const savedFilters = this.loadFilters();

    if (savedFilters) {
      this.filterView.setFilterFields(savedFilters);
      this.handleFilter();
    } else {
      this.refreshUI();
    }
  }

  private saveFilters(filter: FilterData) {
    // Persist filters to maintain UX continuity
    FilterStorageService.save<FilterData>('filters_data', filter);
  }

  private loadFilters(): FilterData | null {
    return FilterStorageService.get<FilterData>('filters_data');
  }

  private refreshUI(): void {
    // Central reload point: ensures UI stays consistent with data source
    const allTransactions = this.transactionService.getAll();
    this.updateUI(allTransactions);
  }

  /**
   * Core UI update pipeline:
   * Ensures table, summary, and chart stay synchronized.
   */
  private updateUI(transactions: Transaction[]): void {
    this.tableView.renderTable(transactions);

    const { income, expense, balance } =
      this.summary.calculateSummary(transactions);
    this.summaryView.updateSummary(income, expense, balance);

    const expenseSummary = this.transactionService.calculate(transactions);

    this.chartView.renderChart(expenseSummary);
  }

  private handleEdit = (id: string): void => {
    this.editingId = id;

    const foundTransaction = this.transactionService.findById(id);

    if (foundTransaction) {
      // Pre-fills form to reuse the same submission flow for updates
      this.formView.fillForm(foundTransaction);
      this.notification.showMessage('Modo de edição ativado', 'info');
    }
  };

  handleFilter = () => {
    const filters = this.filterView.getFilterData();
    const allTransactions = this.transactionService.getAll();

    // Filtering is delegated to service to keep controller thin
    const filteredTransactions = this.transactionService.filterTransactions(
      allTransactions,
      filters
    );

    this.saveFilters(filters);

    this.updateUI(filteredTransactions);
  };

  private handleDelete = (id: string) => {
    const transaction = this.transactionService.findById(id);

    if (transaction) {
      // Deletion requires confirmation, so we store state temporarily
      this.idPendingDeletion = id;
      this.modalView.showConfirmModal();
    }
  };

  private handleConfirmDelete = () => {
    if (this.idPendingDeletion) {
      this.transactionService.delete(this.idPendingDeletion);
      this.refreshUI();
      this.notification.showMessage('Transação removida.', 'success');

      this.idPendingDeletion = undefined;
      this.modalView.hideConfirmModal();
    }
  };

  private handleCancelDelete = () => {
    // Reset deletion state when user cancels
    this.idPendingDeletion = undefined;
    this.modalView.hideConfirmModal();
  };

  private handleSubmit = () => {
    try {
      const data = this.formView.getFormData();

      const newTransaction = new Transaction(
        data.description,
        data.amount,
        data.type,
        data.category,
        data.date,
        this.editingId
      );

      // Same flow handles both create and update to reduce duplication
      if (this.editingId === undefined) {
        this.transactionService.add(newTransaction);

        this.refreshUI();

        this.notification.showMessage(
          'Transação adicionada com sucesso.',
          'success'
        );
      } else {
        const idToHighlight = this.editingId;

        this.transactionService.update(newTransaction);

        this.editingId = undefined;

        this.refreshUI();

        // UX detail: highlight updated row for user feedback
        this.tableView.highlightRow(idToHighlight);

        this.notification.showMessage('Transação atualizada.', 'info');
      }

      this.formView.clearForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.notification.showMessage(error.message, 'error');
      }
    }
  };

  private handleSort = (column: SortColumn) => {
    // Toggle sorting direction if same column is clicked
    if (column === this.sortColumn) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.tableView.updateSortIcons(this.sortColumn, this.sortDirection);

    const allTransactions = this.transactionService.getAll();

    const sortedTransactions = this.transactionService.sortTransactions(
      allTransactions,
      this.sortColumn,
      this.sortDirection
    );

    this.updateUI(sortedTransactions);
  };

  private handleClearFilters = () => {
    // Reset filters and reuse filtering pipeline
    this.filterView.resetFilterFields();
    this.handleFilter();
  };

  private handleSummaryClick = (type: 'income' | 'expense' | 'all') => {
    const currentFilters = this.filterView.getFilterData();

    // Clicking summary cards acts as a quick filter shortcut
    currentFilters.filterType = type;

    this.filterView.setFilterFields(currentFilters);

    this.handleFilter();

    // Sync visual state with selected filter
    this.uiState.updateActiveCard(type);
  };
}
