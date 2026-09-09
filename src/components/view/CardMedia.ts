import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export abstract class CardMedia<T> extends Card<T> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", container);
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    const className = categoryMap[value as keyof typeof categoryMap];
    this.cardCategory.className = className
      ? `card__category ${className}`
      : "card__category";
  }

  set image(value: string) {
    this.setImage(this.cardImage, value, "Изображение товара");
  }
}
