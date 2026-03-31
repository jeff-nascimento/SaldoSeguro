import { Chart, registerables } from 'chart.js';
import { ExpenseSummary } from '../types/ExpenseSummary';

Chart.register(...registerables);

export class ChartView {
  private chartInstance: Chart | null = null;

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
    const hasNoExpenses = values.every((value) => value === 0);

    const existingMessage = canvas.parentElement?.querySelector('.message');
    if (existingMessage) {
      existingMessage.remove();
    }

    if (hasNoExpenses) {
      canvas.style.display = 'none';

      const message = document.createElement('p');
      message.classList.add('message');
      message.innerText = 'Nenhum gasto cadastrado.';

      canvas.parentElement?.appendChild(message);
      return;
    }

    canvas.style.display = 'block';

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

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
