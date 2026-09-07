import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected events: IEvents;
  protected description: HTMLElement;
  protected closeButton: HTMLButtonElement;

  private isBound = false;
  private readonly handleClose = () => this.events.emit("success:close");

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.isBound) return;
    this.closeButton.addEventListener("click", this.handleClose);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.closeButton.removeEventListener("click", this.handleClose);
    this.isBound = false;
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
