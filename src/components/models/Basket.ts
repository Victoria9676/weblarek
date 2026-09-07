import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // получение массива товаров в корзине
  getItems(): IProduct[] {
    return [...this.items];
  }

  // добавление товара в корзину
  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  // удаление товара из корзины
  removeItem(item: IProduct): void {
    this.items = this.items.filter((p) => p.id !== item.id);
    this.events.emit("basket:changed");
  }

  // очистка корзины
  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  // получение стоимости всех товаров
  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  // получение количества товаров
  getCount(): number {
    return this.items.length;
  }

  // проверка наличия товара по id
  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
