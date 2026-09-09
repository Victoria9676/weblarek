import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected closeButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", () => this.close());
    this.modalContent.addEventListener("click", (e) => e.stopPropagation());
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
