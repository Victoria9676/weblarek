import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IPageData {
  catalog: HTMLElement[];
}

export class PageGallery extends Component<IPageData> {
  protected pageGallery: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.pageGallery = ensureElement<HTMLElement>(".gallery", container);
  }

  set catalog(items: HTMLElement[]) {
    this.pageGallery.replaceChildren(...items);
  }
}
