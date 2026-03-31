export class ModalView {
  private modal = document.querySelector('.modal') as HTMLDivElement;
  showConfirmModal(): void {
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
    confirmModalBtn.addEventListener('click', handler);
  }

  bindCancelDelete(handler: () => void): void {
    const cancelModalBtn = document.querySelector(
      '#cancel'
    ) as HTMLButtonElement;

    cancelModalBtn.addEventListener('click', handler);
  }
}
