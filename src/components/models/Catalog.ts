import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  protected products: IProduct[] = [];
  protected selectedProduct: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // сохранение массива товаров, полученного в параметрах
  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:changed");
  }

  // получение массива товаров из модели
  getProducts(): IProduct[] {
    return this.products;
  }

  // получение одного товара по id
  getProduct(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  // сохранение товара для подробного отображения
  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("catalog:selected");
  }

  // получение товара для подробного отображения
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
