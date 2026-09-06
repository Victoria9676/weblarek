import { Card } from "./Card";
import { ICardActions, TCardPreview } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

export class CardPreview extends Card<TCardPreview> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;

  private readonly actions: ICardActions;
  private isBound = false;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.actions = actions;
    this.cardCategory = ensureElement<HTMLElement>(".card__category", container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", container);
    this.cardText = ensureElement<HTMLElement>(".card__text", container);
    this.cardButton = ensureElement<HTMLButtonElement>(".card__button", container);
    this.bindEvents();
  }

  private bindEvents(): void {
    if (this.isBound) return;
    this.cardButton.addEventListener("click", this.actions.onClick);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.cardButton.removeEventListener("click", this.actions.onClick);
    this.isBound = false;
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    const className = categoryMap[value as keyof typeof categoryMap];
    this.cardCategory.className = className
      ? `card__category ${className}`
      : "card__category";
  }

  set image(value: string) {
    const altText = this.cardTitle.textContent || "Изображение товара";
    this.setImage(this.cardImage, `${CDN_URL}${value}`, altText);
  }

  set description(value: string) {
    this.cardText.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    this.syncButtonState();
  }

  set inBasket(value: boolean) {
    if (this.cardButton.disabled) return;
    this.cardButton.textContent = value ? "Удалить из корзины" : "Купить";
  }

  private syncButtonState(): void {
    if (this.price === null) {
      this.cardButton.disabled = true;
      this.cardButton.textContent = "Недоступно";
      return;
    }
    this.cardButton.disabled = false;
  }

  public setData(data: TCardPreview): void {
    // Порядок важен: title до image (для alt), price до inBasket (для кнопки)
    if (data.title !== undefined) this.title = data.title;
    if (data.category !== undefined) this.category = data.category;
    if (data.image !== undefined) this.image = data.image;
    if (data.description !== undefined) this.description = data.description;
    if (data.price !== undefined) this.price = data.price;
    if (data.inBasket !== undefined) this.inBasket = data.inBasket;
  }
}
