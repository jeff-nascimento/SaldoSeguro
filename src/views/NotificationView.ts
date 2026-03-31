import { TypeMessage } from '../types/TypeMessage';

export class NotificationView {
  private notification = document.querySelector(
    '.notification'
  ) as HTMLDivElement;
  private timer?: number;

  showMessage(message: string, type: TypeMessage): void {
    clearTimeout(this.timer);

    this.notification.innerText = message;
    this.notification.className = `notification ${type} show`;

    this.timer = window.setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }

  hideMessage(): void {
    this.notification.classList.remove('show');
  }
}
