/**
 * View responsible for displaying user notifications (feedback messages).
 *
 * Design decision:
 * Handles UI feedback timing internally (auto-hide),
 * keeping the controller focused only on triggering messages.
 */
import { TypeMessage } from '../types/TypeMessage';

export class NotificationView {
  private notification = document.querySelector(
    '.notification'
  ) as HTMLDivElement;

  // Stores timeout reference to prevent overlapping notifications
  private timer?: number;

  showMessage(message: string, type: TypeMessage): void {
    // Clears previous timeout to avoid race conditions between messages
    clearTimeout(this.timer);

    this.notification.innerText = message;

    // Applies dynamic styling based on message type (success, error, info, etc.)
    this.notification.className = `notification ${type} show`;

    // Automatically hides notification after a delay (UX improvement)
    this.timer = window.setTimeout(() => {
      this.notification.classList.remove('show');
    }, 3000);
  }

  hideMessage(): void {
    // Allows manual control when needed (e.g., immediate dismissal)
    this.notification.classList.remove('show');
  }
}
