import { Card } from "./Card";
import { ICardActions, TCardBasket } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardBasket extends Card<TCardBasket> {
  protected cardIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;
  protected actions: ICardActions;

  private isBound = false;
  private readonly handleDelete = () => this.actions.onClick();

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.actions = actions;
    this.cardIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.isBound) return;
    this.cardButton.addEventListener("click", this.handleDelete);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.cardButton.removeEventListener("click", this.handleDelete);
    this.isBound = false;
  }

  setData(data: TCardBasket): void {
    super.setData(data);
    this.index = data.index;
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}
