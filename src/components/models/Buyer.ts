import { IBuyer, TBuyerErrors, TPayment } from "../../types";

export class Buyer {
  protected payment: TPayment | null = null;
  protected email: string | null = null;
  protected phone: string | null = null;
  protected address: string | null = null;

  //сохранение переданных полей
  setData(data: Partial<IBuyer>): void {
    // Обновляем только те поля, которые реально переданы
    if ("payment" in data && data.payment !== undefined) {
      this.payment = data.payment;
    }
    if ("email" in data && data.email !== undefined) {
      this.email = data.email;
    }
    if ("phone" in data && data.phone !== undefined) {
      this.phone = data.phone;
    }
    if ("address" in data && data.address !== undefined) {
      this.address = data.address;
    }
  }

  //возвращение данных о покупателе
  getData(): IBuyer {
    return {
      payment: this.payment ?? ("Наличная оплата" as TPayment), // или выброси ошибку, если payment обязателен
      email: this.email ?? "",
      phone: this.phone ?? "",
      address: this.address ?? "",
    };
  }

  //очистка данных о покупателе
  clear(): void {
    this.payment = null;
    this.email = null;
    this.phone = null;
    this.address = null;  
  }
  //проверка данных о покупателе
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};
    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.email) errors.email = "Необходимо указать email";
    if (!this.phone) errors.phone = "Необходимо указать телефон";
    if (!this.address) errors.address = "Необходимо указать адрес доставки";   
    return errors;
  }
}
