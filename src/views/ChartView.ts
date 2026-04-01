/**
 * View responsible for rendering the expense chart using Chart.js.
 *
 * Design decision:
 * Handles only presentation logic, including UI states (empty data, updates),
 * while keeping data processing minimal and delegated to services.
 */
import { Chart, registerables } from 'chart.js';
import { ExpenseSummary } from '../types/ExpenseSummary';

// Registers all Chart.js components globally once
Chart.register(...registerables);

export class ChartView {
  private chartInstance: Chart | null = null;

  // Maps internal category keys to user-friendly labels
  private categoryLabels: Record<string, string> = {
    food: 'Alimentação',
    transportation: 'Transporte',
    housing: 'Moradia',
    leisure: 'Lazer',
    health: 'Saúde',
  };

  renderChart(summary: ExpenseSummary) {
    const canvas = document.querySelector(
      '#expense-chart'
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const values = Object.values(summary);

    // Detects empty dataset to avoid rendering meaningless chart
    const hasNoExpenses = values.every((value) => value === 0);

    // Ensures previous UI message is removed before re-render
    const existingMessage = canvas.parentElement?.querySelector('.message');
    if (existingMessage) {
      existingMessage.remove();
    }

    if (hasNoExpenses) {
      // Hides chart and shows user-friendly empty state
      canvas.style.display = 'none';

      const message = document.createElement('p');
      message.classList.add('message');
      message.innerText = 'Nenhum gasto cadastrado.';

      canvas.parentElement?.appendChild(message);
      return;
    }

    canvas.style.display = 'block';

    // Prevents memory leaks and duplicated charts on re-render
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    // Translates internal keys into display labels
    const labels = Object.keys(summary).map((key) => this.categoryLabels[key]);

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Gastos por Categoria',
            data: values,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
            ],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
