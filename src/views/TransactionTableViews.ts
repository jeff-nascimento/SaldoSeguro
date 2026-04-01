/**
 * View responsible for rendering the transactions table and handling user interactions.
 *
 * Design decision:
 * Uses event delegation for scalability and performance,
 * avoiding multiple event listeners for each row/button.
 */
import { Transaction } from '../models/Transaction';
import { SortColumn, SortDirection } from '../types/Sorting';
import { Formatter } from '../utils/Formatter';

export class TransactionTableView {
  private transactionsBody = document.querySelector(
    '#transaction-body'
  ) as HTMLBodyElement;

  private transactionsTable = document.querySelector(
    '#transactions-table'
  ) as HTMLTableElement;

  renderTable(transactions: Transaction[]): void {
    // Clears previous state before re-rendering
    this.transactionsBody.innerHTML = '';

    transactions.forEach((t) => {
      const row = document.createElement('tr');

      // Associates DOM element with domain entity
      row.dataset.id = String(t.id);

      row.innerHTML = `
          <td>${t.description}</td>
          <td>${Formatter.currency(t.amount)}</td>
          <td>${t.type}</td>
          <td>${t.type === 'income' ? '' : t.category}</td>
          <td>${Formatter.date(t.date)}</td>
          <td><button class="edit-btn" data-id="${t.id}">Editar</button></td>
          <td><button class="delete-btn" data-id="${t.id}">Excluir</button></td>
        `;

      this.transactionsBody.appendChild(row);
    });
  }

  highlightRow(transactionId: string | number): void {
    const row = document.querySelector(
      `tr[data-id="${transactionId}"]`
    ) as HTMLTableRowElement;

    // Provides temporary visual feedback after update
    row.classList.add('highlight-row');

    setTimeout(() => {
      row.classList.remove('highlight-row');
    }, 3000);
  }

  bindDelete(handler: (id: string) => void): void {
    if (this.transactionsBody) {
      // Event delegation: single listener handles all delete buttons
      this.transactionsBody.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('delete-btn')) {
          const id = target.dataset.id;

          if (id) handler(id);
        }
      });
    }
  }

  bindEdit(handler: (id: string) => void): void {
    if (this.transactionsBody) {
      // Reuses same delegation strategy for edit actions
      this.transactionsBody.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('edit-btn')) {
          const id = target.dataset.id;

          if (id) handler(id);
        }
      });
    }
  }

  bindSort(handler: (field: SortColumn) => void): void {
    if (this.transactionsTable) {
      this.transactionsTable.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('th');

        // Only sortable headers trigger sorting behavior
        if (target && target.classList.contains('sortable')) {
          const field = target.dataset.sort;

          if (field) {
            handler(field as SortColumn);
          }
        }
      });
    }
  }

  updateSortIcons(activeColumn: SortColumn, direction: SortDirection): void {
    const headers = this.transactionsTable.querySelectorAll('th.sortable');

    headers.forEach((header) => {
      const icon = header.querySelector('.sort-icon') as HTMLElement;
      const column = header.getAttribute('data-sort') as SortColumn;

      // Resets all icons before applying active state
      icon.classList.remove('fi-ss-caret-up', 'fi-ss-caret-down');

      if (column === activeColumn) {
        const classToAdd =
          direction === 'asc' ? 'fi-ss-caret-up' : 'fi-ss-caret-down';

        // Reflects current sorting state visually
        icon.classList.add(classToAdd);
      }
    });
  }
}
