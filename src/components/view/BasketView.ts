import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasketView, IBasketData } from "../../types";

export class BasketView extends Component<IBasketData> implements IBasketView {
  protected events: IEvents;
  protected list: HTMLElement;
  protected basketTotal: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.basketTotal = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );
    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:order");
    });
  }

  set items(items: HTMLElement[]) {
    this.list.replaceChildren(...items);
  }

  set total(value: number) {
    this.basketTotal.textContent = `${value} синапсов`;
  }

  set isOrderButtonEnabled(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
