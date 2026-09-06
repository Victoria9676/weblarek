import "./scss/styles.scss";
import { API_URL } from "./utils/constants";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { CardCatalog } from "./components/view/CardCatalog";
import { CardPreview } from "./components/view/CardPreview";
import { CardBasket } from "./components/view/CardBasket";
import { Modal } from "./components/view/Modal";
import { Page } from "./components/view/Page";
import { BasketView } from "./components/view/BasketView";

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalog = new Catalog();
const basket = new Basket();

const page = new Page(document.body, events);
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate("#basket"), events);

let currentPreview: CardPreview | null = null;

const renderBasket = () => {
  const items = basket.getItems().map((product, index) => {
    const cardContainer = cloneTemplate("#card-basket");
    const card = new CardBasket(cardContainer, {
      onClick: () => events.emit("card:delete", { id: product.id }),
    });
    card.setData({
      index: index + 1,
      title: product.title,
      price: product.price,
    });
    return cardContainer;
  });
  basketView.items = items;
  basketView.total = basket.getTotal();
};

events.on<{ id: string }>("card:select", ({ id }) => {
  const product = catalog.getProduct(id);
  if (!product) return;

  catalog.setSelectedProduct(product);

  if (currentPreview) {
    currentPreview.unbind();
  }

  const previewContainer = cloneTemplate("#card-preview");
  currentPreview = new CardPreview(previewContainer, {
    onClick: () => events.emit("card:action"),
  });

  currentPreview.setData({
    title: product.title,
    description: product.description,
    image: product.image,
    category: product.category,
    price: product.price,
    inBasket: basket.hasItem(id),
  });

  modal.render({ content: previewContainer });
  modal.open();
});

events.on("card:action", () => {
  const product = catalog.getSelectedProduct();
  if (!product) return;

  if (basket.hasItem(product.id)) {
    basket.removeItem(product);
  } else {
    basket.addItem(product);
  }

  if (currentPreview) {
    currentPreview.inBasket = basket.hasItem(product.id);
  }

  modal.close();
  page.counter = basket.getCount();
});

events.on("basket:open", () => {
  renderBasket();
  modal.render({ content: basketView.render() });
  modal.open();
});

events.on<{ id: string }>("card:delete", ({ id }) => {
  const product = catalog.getProduct(id);
  if (product) {
    basket.removeItem(product);
  }
  renderBasket();
  page.counter = basket.getCount();
});

events.on("basket:order", () => {
  console.log("Оформление заказа");
});

larekApi
  .getProducts()
  .then((data) => {
    if (!data?.items || !Array.isArray(data.items)) {
      console.warn("Некорректные данные каталога", data);
      return;
    }

    catalog.setProducts(data.items);

    const cards = catalog.getProducts().map((product) => {
      const cardContainer = cloneTemplate("#card-catalog");
      const card = new CardCatalog(cardContainer, {
        onClick: () => events.emit("card:select", { id: product.id }),
      });

      card.setData({
        title: product.title,
        price: product.price,
        category: product.category,
        image: product.image,
      });

      return cardContainer;
    });

    page.catalog = cards;
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
