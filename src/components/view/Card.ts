import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export abstract class Card<T> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;
  protected _price: number | null = null;

  constructor(container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", container);
  }

  setData(data: Partial<T>): void {
    const d = data as Record<string, unknown>;
    if (d.title !== undefined) this.title = d.title as string;
    if (d.price !== undefined) this.price = d.price as number | null;
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this._price = value;
    this.cardPrice.textContent = this.formatPrice(value);
  }

  get price(): number | null {
    return this._price;
  }

  protected formatPrice(value: number | null): string {
    return value === null ? "Бесценно" : `${value} синапсов`;
  }
}
