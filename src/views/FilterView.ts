import { FilterData } from '../types/FilterData';

export class FilterView {
  private filterType = document.querySelector(
    '#filter-type'
  ) as HTMLSelectElement;
  private filterCategory = document.querySelector(
    '#filter-category'
  ) as HTMLSelectElement;
  private filterStartDate = document.querySelector(
    '#start-date'
  ) as HTMLInputElement;
  private filterEndDate = document.querySelector(
    '#end-date'
  ) as HTMLInputElement;
  private filterDescription = document.querySelector(
    '#filter-description'
  ) as HTMLInputElement;

  getFilterData(): FilterData {
    return {
      filterType: this.filterType.value as FilterData['filterType'],
      filterCategory: this.filterCategory.value as FilterData['filterCategory'],
      filterStartDate: this.filterStartDate.value || undefined,
      filterEndDate: this.filterEndDate.value || undefined,
      filterDescription: this.filterDescription.value,
    };
  }

  setFilterFields(filter: FilterData) {
    this.filterType.value = filter.filterType || 'all';
    this.filterCategory.value = filter.filterCategory || 'all';
    this.filterDescription.value = filter.filterDescription || '';
    this.filterStartDate.value = filter.filterStartDate || '';
    this.filterEndDate.value = filter.filterEndDate || '';

    this.excludeCategoryFromFilters();
  }

  resetFilterFields(): void {
    this.filterType.value = 'all';
    this.filterCategory.value = 'all';
    this.filterStartDate.value = '';
    this.filterEndDate.value = '';
    this.filterDescription.value = '';
  }

  excludeCategoryFromFilters(): void {
    if (this.filterType && this.filterCategory) {
      const updateVisibility = () => {
        if (
          this.filterType.value === 'income' ||
          this.filterType.value === 'all'
        ) {
          this.filterCategory.style.display = 'none';
          this.filterCategory.value = 'all';
        } else {
          this.filterCategory.style.display = 'inline-block';
          if (this.filterCategory.value === '') {
            this.filterCategory.selectedIndex = 0;
          }
        }
      };

      updateVisibility();

      this.filterType.addEventListener('change', () => {
        updateVisibility();

        this.filterCategory.dispatchEvent(new Event('change'));
      });
    }
  }

  bindFilterChange(handler: () => void): void {
    if (this.filterType) {
      this.filterType.addEventListener('change', () => {
        handler();
      });
    }

    if (this.filterCategory) {
      this.filterCategory.addEventListener('change', () => {
        handler();
      });
    }

    if (this.filterStartDate) {
      this.filterStartDate.addEventListener('change', () => {
        handler();
      });
    }

    if (this.filterEndDate) {
      this.filterEndDate.addEventListener('change', handler);
    }

    if (this.filterDescription) {
      this.filterDescription.addEventListener('input', () => {
        handler();
      });
    }
  }

  bindClearFilters(handler: () => void): void {
    const resetFilters = document.querySelector(
      '#clear-filters'
    ) as HTMLButtonElement;
    resetFilters.addEventListener('click', handler);
  }
}
