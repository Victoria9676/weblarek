import { IProduct } from '../../types';

export class Basket {
  protected items: IProduct[] = [];

  // получение массива товаров в корзине
  getItems(): IProduct[] {
    return [...this.items];
  }

  // добавление товара в корзину
  addItem(item: IProduct): void {
    this.items.push(item);
  }

  // удаление товара из корзины
  removeItem(item: IProduct): void {
    this.items = this.items.filter((p) => p.id !== item.id);
  }

  // очистка корзины
  clear(): void {
    this.items = [];
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