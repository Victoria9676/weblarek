import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IPageData {
  catalog: HTMLElement[];
  counter: number;
}

export class Page extends Component<IPageData> {
  protected events: IEvents;
  protected pageGallery: HTMLElement;
  protected pageCounter: HTMLElement;
  protected basketButton: HTMLButtonElement;

  private isBound = false;
  private readonly handleBasketOpen = () => this.events.emit("basket:open");

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.pageGallery = ensureElement<HTMLElement>(".gallery", container);
    this.pageCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.isBound) return;
    this.basketButton.addEventListener('click', this.handleBasketOpen);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.basketButton.removeEventListener('click', this.handleBasketOpen);
    this.isBound = false;
  }

  set catalog(items: HTMLElement[]) {
    this.pageGallery.replaceChildren(...items);
  }

  set counter(value: number) {
    this.pageCounter.textContent = String(value);
  }
}
