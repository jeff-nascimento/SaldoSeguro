/**
 * View responsible for handling modal visibility and user interactions.
 *
 * Design decision:
 * Keeps DOM manipulation and event binding isolated from the controller,
 * allowing the controller to focus only on business flow.
 */
export class ModalView {
  private modal = document.querySelector('.modal') as HTMLDivElement;

  showConfirmModal(): void {
    // Controls visibility via CSS classes to allow animations/transitions
    this.modal.classList.remove('hide-modal');
    this.modal.classList.add('show-modal');
  }

  hideConfirmModal() {
    this.modal.classList.remove('show-modal');
    this.modal.classList.add('hide-modal');
  }

  bindConfirmDelete(handler: () => void): void {
    const confirmModalBtn = document.querySelector(
      '#confirm'
    ) as HTMLButtonElement;

    // Delegates action handling to controller
    confirmModalBtn.addEventListener('click', handler);
  }

  bindCancelDelete(handler: () => void): void {
    const cancelModalBtn = document.querySelector(
      '#cancel'
    ) as HTMLButtonElement;

    // Keeps modal behavior flexible by externalizing logic
    cancelModalBtn.addEventListener('click', handler);
  }
}
