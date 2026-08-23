import { IApi, IProductsResponse, IOrder, IOrderResult } from "../types";

export class LarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>("/product/");
  }

  postOrder(order: IOrder): Promise<IOrderResult> {
    if (!order.items || order.items.length === 0) {
      return Promise.reject(new Error("Корзина не может быть пустой"));
    }
    if (order.total < 0) {
      return Promise.reject(new Error("Некорректная сумма заказа"));
    }

    return this.api.post<IOrderResult>("/order/", order, "POST");
  }
}
