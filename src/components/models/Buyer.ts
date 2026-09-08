import { IBuyer, TBuyerErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null = null;
  protected email: string = "";
  protected phone: string = "";
  protected address: string = "";
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  //сохранение переданных полей
  setData(data: Partial<IBuyer>): void {
    // Обновляем только те поля, которые реально переданы
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    this.events.emit("buyer:changed");
  }

  //возвращение данных о покупателе
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  //очистка данных о покупателе
  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed");
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
