import { CardMedia } from "./CardMedia";
import { ICardActions, TCardPreview } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardPreview extends CardMedia<TCardPreview> {
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.cardText = ensureElement<HTMLElement>(".card__text", container);
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );
    this.cardButton.addEventListener("click", (e: MouseEvent) => {
      actions.onClick(e);
    });
  }

  render(data: TCardPreview): HTMLElement {
    this.setImage(this.cardImage, data.image, data.title);
    this.category = data.category;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;

    this.buttonText = data.buttonText;
    this.buttonDisabled = data.buttonDisabled;

    return this.container;
  }

  set description(value: string) {
    this.cardText.textContent = value;
  }

  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
