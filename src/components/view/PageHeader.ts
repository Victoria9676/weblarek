import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IPageData {
  counter: number;
}

export class PageHeader extends Component<IPageData> {
  protected pageCounter: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.pageCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );
    this.basketButton.addEventListener("click", () => {
      events.emit("basket:open");
    });
  }

  set counter(value: number) {
    this.pageCounter.textContent = String(value);
  }
}
