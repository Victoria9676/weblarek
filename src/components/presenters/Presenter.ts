import { IEvents } from "../base/Events";
import {
  ICatalog,
  IBasket,
  IBuyerModel,
  ILarekApi,
  IPageHeader,
  IPageGallery,
  IModal,
  IBasketView,
  IOrderView,
  IContactsView,
  ISuccessView,
  ICardPreview,
  TPayment,
  ICardCatalogConstructor,
  ICardBasketConstructor,
} from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export class Presenter {
  constructor(
    private events: IEvents,
    private catalog: ICatalog,
    private basket: IBasket,
    private buyer: IBuyerModel,
    private api: ILarekApi,
    private pageHeader: IPageHeader,
    private pageGallery: IPageGallery,
    private modal: IModal,
    private basketView: IBasketView,
    private order: IOrderView,
    private contacts: IContactsView,
    private success: ISuccessView,
    private cardPreview: ICardPreview,
    private CardCatalogClass: ICardCatalogConstructor,
    private CardBasketClass: ICardBasketConstructor,
  ) {
    this.bindEvents();
  }

  private bindEvents(): void {
    // ===== События от моделей — только здесь перерисовка =====

    this.events.on("catalog:changed", () => this.renderCatalog());

    this.events.on("basket:changed", () => {
      this.pageHeader.render({ counter: this.basket.getCount() });
      this.renderBasket();
    });

    this.events.on("buyer:changed", () => {
      this.validateOrder();
      this.validateContacts();
    });

    this.events.on("catalog:selected", () => {
      const product = this.catalog.getSelectedProduct();
      if (!product) return;

      const inBasket = this.basket.hasItem(product.id);
      const isUnavailable = product.price === null;

      const buttonText = isUnavailable
        ? "Недоступно"
        : inBasket
          ? "Удалить из корзины"
          : "Купить";
      const buttonDisabled = isUnavailable;

      this.modal.render({
        content: this.cardPreview.render({
          title: product.title,
          description: product.description,
          image: `${CDN_URL}${product.image}`,
          category: product.category,
          price: product.price,
          buttonText,
          buttonDisabled,
        }),
      });
      this.modal.open();
    });

    // ===== События от представлений — только изменение моделей =====

    this.events.on<{ id: string }>("card:select", ({ id }) => {
      const product = this.catalog.getProduct(id);
      if (product) {
        this.catalog.setSelectedProduct(product);
      }
    });

    this.events.on("card:action", () => {
      const product = this.catalog.getSelectedProduct();
      if (!product) return;

      if (this.basket.hasItem(product.id)) {
        this.basket.removeItem(product);
      } else {
        this.basket.addItem(product);
      }
      this.modal.close();
    });

    this.events.on("basket:open", () => {
      this.modal.render({ content: this.basketView.render() });
      this.modal.open();
    });

    this.events.on<{ id: string }>("card:delete", ({ id }) => {
      const product = this.catalog.getProduct(id);
      if (product) {
        this.basket.removeItem(product);
      }
    });

    this.events.on("basket:order", () => {
      this.modal.render({ content: this.order.render() });
      this.modal.open();
    });

    this.events.on<{ value: string }>("order.address:change", ({ value }) => {
      this.buyer.setData({ address: value });
    });

    this.events.on<{ payment: TPayment }>("order:payment", ({ payment }) => {
      this.buyer.setData({ payment });
    });

    this.events.on("order:submit", () => {
      this.modal.render({ content: this.contacts.render() });
      this.modal.open();
    });

    this.events.on<{ value: string }>("contacts.email:change", ({ value }) => {
      this.buyer.setData({ email: value });
    });

    this.events.on<{ value: string }>("contacts.phone:change", ({ value }) => {
      this.buyer.setData({ phone: value });
    });

    this.events.on("contacts:submit", () => this.handleContactsSubmit());

    this.events.on("success:close", () => {
      this.modal.close();
    });
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
      const card = new this.CardCatalogClass(cardContainer, {
        onClick: () => this.events.emit("card:select", { id: product.id }),
      });
      return card.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: `${CDN_URL}${product.image}`,
      });
    });
    this.pageGallery.render({ catalog: cards });
  }

  private renderBasket(): void {
    const items = this.basket.getItems().map((product, index) => {
      const cardContainer = cloneTemplate("#card-basket");
      const card = new this.CardBasketClass(cardContainer, {
        onClick: () => this.events.emit("card:delete", { id: product.id }),
      });
      return card.render({
        index: index + 1,
        title: product.title,
        price: product.price,
      });
    });
    this.basketView.render({
      items,
      total: this.basket.getTotal(),
      isOrderButtonEnabled: items.length > 0,
    });
  }

  private validateOrder(): void {
    const errors = this.buyer.validate();
    const data = this.buyer.getData();
    this.order.render({
      valid: !errors.payment && !errors.address,
      errors: [errors.payment, errors.address].filter(Boolean).join("; "),
      payment: data.payment ?? "",
      address: data.address,
    });
  }

  private validateContacts(): void {
    const errors = this.buyer.validate();
    const data = this.buyer.getData();
    this.contacts.render({
      valid: !errors.email && !errors.phone,
      errors: [errors.email, errors.phone].filter(Boolean).join("; "),
      email: data.email,
      phone: data.phone,
    });
  }

  private resetForms(): void {
    this.buyer.clear();
    this.order.render({
      payment: "",
      address: "",
      valid: false,
      errors: "",
    });

    this.contacts.render({
      email: "",
      phone: "",
      valid: false,
      errors: "",
    });
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
      this.resetForms();
    } catch (error) {
      console.error(error);
    }
  }
}
