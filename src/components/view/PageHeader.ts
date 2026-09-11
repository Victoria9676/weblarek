import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IPageHeader, IPageHeaderData } from "../../types";

export class PageHeader
  extends Component<IPageHeaderData>
  implements IPageHeader
{
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
