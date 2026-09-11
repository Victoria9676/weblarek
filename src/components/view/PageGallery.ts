import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IPageGallery, IPageGalleryData } from "../../types";

export class PageGallery
  extends Component<IPageGalleryData>
  implements IPageGallery
{
  protected pageGallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.pageGallery = ensureElement<HTMLElement>(".gallery", container);
  }

  set catalog(items: HTMLElement[]) {
    this.pageGallery.replaceChildren(...items);
  }
}
