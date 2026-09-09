import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketData> {
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
    if (items.length) {
      this.list.replaceChildren(...items);
    }
  }

  set total(value: number) {
    this.basketTotal.textContent = `${value} синапсов`;
  }

  set isOrderButtonEnabled(value: boolean) {
    this.orderButton.disabled = !value;
  }

  public setData(data: Partial<IBasketData>): void {
    if (data.items !== undefined) {
      this.items = data.items;
    }
    if (data.total !== undefined) {
      this.total = data.total;
    }
  }
}
