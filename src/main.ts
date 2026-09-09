import "./scss/styles.scss";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { PageHeader } from "./components/view/PageHeader";
import { PageGallery } from "./components/view/PageGallery";
import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";
import { CardPreview } from "./components/view/CardPreview";
import { Presenter } from "./components/presenters/Presenter";
import { API_URL } from "./utils/constants";

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const pageHeader = new PageHeader(document.body, events);
const pageGallery = new PageGallery(document.body);
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(modalContainer);
const basketView = new BasketView(cloneTemplate("#basket"), events);
const order = new Order(cloneTemplate<HTMLFormElement>("#order"), events);
const contacts = new Contacts(
  cloneTemplate<HTMLFormElement>("#contacts"),
  events,
);
const success = new Success(cloneTemplate("#success"), events);
const cardPreview = new CardPreview(cloneTemplate("#card-preview"), {
  onClick: () => events.emit("card:action"),
});

const presenter = new Presenter(
  events,
  catalog,
  basket,
  buyer,
  larekApi,
  pageHeader,
  pageGallery,
  modal,
  basketView,
  order,
  contacts,
  success,
  cardPreview,
);

presenter.init().catch(console.error);
