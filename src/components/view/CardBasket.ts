import { Card } from "./Card";
import { ICardActions, TCardBasket, ICardBasketView } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardBasket extends Card<TCardBasket> implements ICardBasketView {
  protected cardIndex: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.cardIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
    this.cardButton.addEventListener("click", () => {
      actions.onClick();
    });
  }

  set index(value: number) {
    this.cardIndex.textContent = String(value);
  }
}
