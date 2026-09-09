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
} from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { CardCatalog } from "../view/CardCatalog";
import { CardBasket } from "../view/CardBasket";

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
  ) {
    this.bindEvents();
  }

  private bindEvents(): void {
    // ===== События от моделей — только здесь перерисовка =====

    this.events.on("catalog:changed", () => this.renderCatalog());

    this.events.on("basket:changed", () => {
      this.pageHeader.counter = this.basket.getCount();
      this.renderBasket();
    });

    this.events.on("buyer:changed", () => {
      const data = this.buyer.getData();

      // Перерисовка формы заказа
      this.order.payment = data.payment ?? "";
      this.order.address = data.address;
      this.validateOrder();

      // Перерисовка формы контактов
      this.contacts.email = data.email;
      this.contacts.phone = data.phone;
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

      this.modal.content = this.cardPreview.render({
        title: product.title,
        description: product.description,
        image: `${CDN_URL}${product.image}`,
        category: product.category,
        price: product.price,
        buttonText,
        buttonDisabled,
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
      this.modal.content = this.basketView.render();
      this.modal.open();
    });

    this.events.on<{ id: string }>("card:delete", ({ id }) => {
      const product = this.catalog.getProduct(id);
      if (product) {
        this.basket.removeItem(product);
      }
    });

    this.events.on("basket:order", () => {
      this.modal.content = this.order.render();
      this.modal.open();
    });

    this.events.on<{ value: string }>("order.address:change", ({ value }) => {
      this.buyer.setData({ address: value });
    });

    this.events.on<{ payment: TPayment }>("order:payment", ({ payment }) => {
      this.buyer.setData({ payment });
    });

    this.events.on("order:submit", () => {
      this.modal.content = this.contacts.render();
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
      const card = new CardCatalog(cardContainer, {
        onClick: () => this.events.emit("card:select", { id: product.id }),
      });
      return card.render({
        title: product.title,
        price: product.price,
        category: product.category,
        image: `${CDN_URL}${product.image}`,
      });
    });
    this.pageGallery.catalog = cards;
  }

  private renderBasket(): void {
    const items = this.basket.getItems().map((product, index) => {
      const cardContainer = cloneTemplate("#card-basket");
      const card = new CardBasket(cardContainer, {
        onClick: () => this.events.emit("card:delete", { id: product.id }),
      });
      return card.render({
        index: index + 1,
        title: product.title,
        price: product.price,
      });
    });
    this.basketView.items = items;
    this.basketView.total = this.basket.getTotal();
    this.basketView.isOrderButtonEnabled = items.length > 0;
  }

  private validateOrder(): void {
    const errors = this.buyer.validate();
    this.order.valid = !errors.payment && !errors.address;
    this.order.errors = [errors.payment, errors.address]
      .filter(Boolean)
      .join("; ");
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
      this.modal.content = this.success.render({ total: result.total });
      this.basket.clear();
      this.buyer.clear();
    } catch (error) {
      console.error(error);
    }
  }
}
