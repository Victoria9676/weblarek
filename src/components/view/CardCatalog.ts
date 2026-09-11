import { CardMedia } from "./CardMedia";
import { ICardActions, IProduct, ICardCatalogView } from "../../types";
type TCardCatalog = Pick<IProduct, "title" | "price" | "category" | "image">;

export class CardCatalog
  extends CardMedia<TCardCatalog>
  implements ICardCatalogView
{
  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.container.addEventListener("click", () => {
      actions.onClick();
    });
  }
}
