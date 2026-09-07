import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected events: IEvents;
  protected closeButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  private isBound = false;
  private readonly handleClose = () => this.close();
  private readonly handleStopPropagation = (event: Event) =>
    event.stopPropagation();

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );
    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.isBound) return;
    this.closeButton.addEventListener("click", this.handleClose);
    this.container.addEventListener("click", this.handleClose);
    this.modalContent.addEventListener("click", this.handleStopPropagation);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.closeButton.removeEventListener("click", this.handleClose);
    this.container.removeEventListener("click", this.handleClose);
    this.modalContent.removeEventListener("click", this.handleStopPropagation);
    this.isBound = false;
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }

  open() {
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }

  render(data?: Partial<IModalData>): HTMLElement {
    super.render(data);
    if (data?.content) {
      this.content = data.content;
    }
    return this.container;
  }
}
