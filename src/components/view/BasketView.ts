import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement, createElement } from "../../utils/utils";

interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketData> {
  protected events: IEvents;
  protected list: HTMLElement;
  protected basketTotal: HTMLElement;
  protected orderButton: HTMLButtonElement;

  private isBound = false;
  private readonly handleOrderClick = () => this.events.emit("basket:order");

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.basketTotal = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.bindEvents();
  }
  private bindEvents(): void {
    if (this.isBound) return;
    this.orderButton.addEventListener("click", this.handleOrderClick);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.orderButton.removeEventListener("click", this.handleOrderClick);
    this.isBound = false;
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this.list.replaceChildren(...items);
      this.orderButton.disabled = false;
    } else {
      this.list.replaceChildren(
        createElement<HTMLElement>("p", { textContent: "Корзина пуста" }),
      );
      this.orderButton.disabled = true;
    }
  }

  set total(value: number) {
    this.basketTotal.textContent = `${value} синапсов`;
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
