import "./scss/styles.scss";
import { ensureElement, cloneTemplate } from "./utils/utils";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { Catalog } from "./components/models/Catalog";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Page } from "./components/view/Page";
import { Modal } from "./components/view/Modal";
import { BasketView } from "./components/view/BasketView";
import { Order } from "./components/view/Order";
import { Contacts } from "./components/view/Contacts";
import { Success } from "./components/view/Success";
import { Presenter } from "./components/presenters/Presenter";
import { API_URL } from "./utils/constants";

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

const page = new Page(document.body, events);
const modalContainer = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(modalContainer, events);
const basketView = new BasketView(cloneTemplate("#basket"), events);
const order = new Order(cloneTemplate<HTMLFormElement>("#order"), events);
const contacts = new Contacts(
  cloneTemplate<HTMLFormElement>("#contacts"),
  events,
);
const success = new Success(cloneTemplate("#success"), events);

const presenter = new Presenter(
  events,
  catalog,
  basket,
  buyer,
  larekApi,
  page,
  modal,
  basketView,
  order,
  contacts,
  success,
);

presenter.init().catch(console.error);
