import { IEvents } from "../base/Events";
import { Catalog } from "../models/Catalog";
import { Basket } from "../models/Basket";
import { Buyer } from "../models/Buyer";
import { LarekApi } from "../LarekApi";
import { Page } from "../view/Page";
import { Modal } from "../view/Modal";
import { BasketView } from "../view/BasketView";
import { Order } from "../view/Order";
import { Contacts } from "../view/Contacts";
import { Success } from "../view/Success";
import { CardCatalog } from "../view/CardCatalog";
import { CardPreview } from "../view/CardPreview";
import { CardBasket } from "../view/CardBasket";
import { cloneTemplate } from "../../utils/utils";

export class Presenter {
  private currentPreview: CardPreview | null = null;

  constructor(
    private events: IEvents,
    private catalog: Catalog,
    private basket: Basket,
    private buyer: Buyer,
    private api: LarekApi,
    private page: Page,
    private modal: Modal,
    private basketView: BasketView,
    private order: Order,
    private contacts: Contacts,
    private success: Success,
  ) {
    this.bindEvents();
  }

  private bindEvents(): void {
    this.events.on("catalog:changed", () => this.renderCatalog());
    this.events.on("basket:changed", () => {
      this.page.counter = this.basket.getCount();
    });

    this.events.on<{ id: string }>("card:select", ({ id }) =>
      this.handleCardSelect(id),
    );
    this.events.on("card:action", () => this.handleCardAction());
    this.events.on("basket:open", () => this.handleBasketOpen());
    this.events.on<{ id: string }>("card:delete", ({ id }) =>
      this.handleCardDelete(id),
    );

    this.events.on("basket:order", () => this.handleBasketOrder());
    this.events.on<{ value: string }>("order.address:change", ({ value }) => {
      this.buyer.setData({ address: value });
      this.validateOrder();
    });
    this.events.on<{ payment: "card" | "cash" }>(
      "order:payment",
      ({ payment }) => {
        this.buyer.setData({ payment });
        this.order.payment = payment;
        this.validateOrder();
      },
    );

    this.events.on("order:submit", () => this.handleOrderSubmit());
    this.events.on<{ value: string }>("contacts.email:change", ({ value }) => {
      this.buyer.setData({ email: value });
      this.validateContacts();
    });
    this.events.on<{ value: string }>("contacts.phone:change", ({ value }) => {
      this.buyer.setData({ phone: value });
      this.validateContacts();
    });

    this.events.on("contacts:submit", () => this.handleContactsSubmit());
    this.events.on("success:close", () => this.modal.close());
  }

  public async init(): Promise<void> {
    try {
      const data = await this.api.getProducts();
      if (!data?.items || !Array.isArray(data.items)) {
        console.warn("Некорректные данные каталога", data);
        return;
      }
      this.catalog.setProducts(data.items);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  private renderCatalog(): void {
    const cards = this.catalog.getProducts().map((product) => {
      const cardContainer = cloneTemplate("#card-catalog");
      const card = new CardCatalog(cardContainer, {
        onClick: () => this.events.emit("card:select", { id: product.id }),
      });
      return card.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
      });
    });
    this.page.catalog = cards;
  }

  private handleCardSelect(id: string): void {
    const product = this.catalog.getProduct(id);
    if (!product) return;

    this.catalog.setSelectedProduct(product);

    if (this.currentPreview) {
      this.currentPreview.unbind();
    }

    const previewContainer = cloneTemplate("#card-preview");
    this.currentPreview = new CardPreview(previewContainer, {
      onClick: () => this.events.emit("card:action"),
    });

    this.currentPreview.setData({
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price,
      inBasket: this.basket.hasItem(id),
    });

    this.modal.render({ content: previewContainer });
    this.modal.open();
  }

  private handleCardAction(): void {
    const product = this.catalog.getSelectedProduct();
    if (!product) return;

    if (this.basket.hasItem(product.id)) {
      this.basket.removeItem(product);
    } else {
      this.basket.addItem(product);
    }

    if (this.currentPreview) {
      this.currentPreview.inBasket = this.basket.hasItem(product.id);
    }

    this.modal.close();
  }

  private handleBasketOpen(): void {
    this.renderBasket();
    this.modal.render({ content: this.basketView.render() });
    this.modal.open();
  }

  private renderBasket(): void {
    const items = this.basket.getItems().map((product, index) => {
      const cardContainer = cloneTemplate("#card-basket");
      const card = new CardBasket(cardContainer, {
        onClick: () => this.events.emit("card:delete", { id: product.id }),
      });
      card.setData({
        index: index + 1,
        title: product.title,
        price: product.price,
      });
      return cardContainer;
    });
    this.basketView.items = items;
    this.basketView.total = this.basket.getTotal();
  }

  private handleCardDelete(id: string): void {
    const product = this.catalog.getProduct(id);
    if (product) {
      this.basket.removeItem(product);
    }
    this.renderBasket();
  }

  private handleBasketOrder(): void {
    this.modal.render({ content: this.order.render() });
    this.order.payment = this.buyer.getData().payment ?? "";
    this.validateOrder();
  }

  private validateOrder(): void {
    const errors = this.buyer.validate();
    this.order.valid = !errors.payment && !errors.address;
    this.order.errors = [errors.payment, errors.address]
      .filter(Boolean)
      .join("; ");
  }

  private handleOrderSubmit(): void {
    this.modal.render({ content: this.contacts.render() });
    this.validateContacts();
  }

  private validateContacts(): void {
    const errors = this.buyer.validate();
    this.contacts.valid = !errors.email && !errors.phone;
    this.contacts.errors = [errors.email, errors.phone]
      .filter(Boolean)
      .join("; ");
  }

  private async handleContactsSubmit(): Promise<void> {
    const orderData = {
      ...this.buyer.getData(),
      total: this.basket.getTotal(),
      items: this.basket.getItems().map((p) => p.id),
    };

    try {
      const result = await this.api.postOrder(orderData);
      this.modal.render({
        content: this.success.render({ total: result.total }),
      });
      this.basket.clear();
      this.buyer.clear();
      this.order.reset();
      this.contacts.reset();
    } catch (error) {
      console.error(error);
    }
  }
}
