export class Formatter {
  static currency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  static date(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
    });
  }
}
