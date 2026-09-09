import { CardMedia } from "./CardMedia";
import { ICardActions, IProduct } from "../../types";

type TCardCatalog = Pick<IProduct, "title" | "price" | "category" | "image">;

export class CardCatalog extends CardMedia<TCardCatalog> {
  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.container.addEventListener("click", (e: MouseEvent) => {
      actions.onClick(e);
    });
  }
}
