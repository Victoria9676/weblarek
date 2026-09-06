import { Card } from "./Card";
import { ICardActions, IProduct } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";

type TCardCatalog = Pick<IProduct, "title" | "price" | "category" | "image">;

export class CardCatalog extends Card<TCardCatalog> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  private readonly actions: ICardActions;
  private isBound = false;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.actions = actions;
    this.cardCategory = ensureElement<HTMLElement>(".card__category", container);
    this.cardImage = ensureElement<HTMLImageElement>(".card__image", container);
    this.bindEvents();
  }

  private handleCardClick = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-action]")) return;
    this.actions.onClick(e);
  };

  private bindEvents(): void {
    if (this.isBound) return;
    container.addEventListener("click", this.handleCardClick);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.container.removeEventListener("click", this.handleCardClick);
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

  public setData(data: TCardCatalog): void {
    if (data.title !== undefined) this.title = data.title;
    if (data.image !== undefined) this.image = data.image;
    if (data.category !== undefined) this.category = data.category;
    if (data.price !== undefined) this.price = data.price;
  }
}
