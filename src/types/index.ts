export type ApiPostMethods = "POST" | "PUT" | "DELETE";

// --- API ---
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

// --- Данные и типы ---
export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Типы карточек выводятся из IProduct (Pick/Omit) — при изменении IProduct все карточки обновятся автоматически
export type TCardPreview = Omit<IProduct, "id"> & {
  buttonText: string;
  buttonDisabled: boolean;
};
export type TCardCatalog = Pick<
  IProduct,
  "title" | "price" | "category" | "image"
>;
export type TCardBasket = Pick<IProduct, "title" | "price"> & { index: number };

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface ICardActions {
  onClick: (event?: MouseEvent) => void;
}

// --- Типы данных для render() каждого view ---
export interface IPageHeaderData {
  counter: number;
}

export interface IPageGalleryData {
  catalog: HTMLElement[];
}

export interface IBasketData {
  items: HTMLElement[];
  total: number;
  isOrderButtonEnabled: boolean;
}

export interface IOrderViewData {
  payment: TPayment | "";
  address: string;
  valid: boolean;
  errors: string;
}

export interface IContactsViewData {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
}

export interface IModalData {
  content: HTMLElement;
}

// --- Модели (интерфейсы для Presenter) ---
export interface ICatalog {
  setProducts(items: IProduct[]): void;
  getProducts(): IProduct[];
  getProduct(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct): void;
  getSelectedProduct(): IProduct | null;
}

export interface IBasket {
  addItem(product: IProduct): void;
  removeItem(product: IProduct): void;
  hasItem(id: string): boolean;
  getItems(): IProduct[];
  getTotal(): number;
  getCount(): number;
  clear(): void;
}

export interface IBuyerModel {
  setData(data: Partial<IBuyer>): void;
  getData(): IBuyer;
  validate(): TBuyerErrors;
  clear(): void;
}

// --- Интерфейсы API ---
export interface ILarekApi {
  getProducts(): Promise<{ items: IProduct[] }>;
  postOrder(data: IOrder): Promise<IOrderResult>;
}

// --- View (интерфейсы, от которых зависит Presenter) — только render(data)---
export interface IPageHeader {
  render(data: Partial<IPageHeaderData>): HTMLElement;
}

export interface IPageGallery {
  render(data: Partial<IPageGalleryData>): HTMLElement;
}

export interface IModal {
  render(data: Partial<IModalData>): HTMLElement;
  open(): void;
  close(): void;
}

export interface IBasketView {
  render(data?: Partial<IBasketData>): HTMLElement;
}

export interface IOrderView {
  render(data?: Partial<IOrderViewData>): HTMLElement;
}

export interface IContactsView {
  render(data?: Partial<IContactsViewData>): HTMLElement;
}

export interface ISuccessView {
  render(data?: { total: number }): HTMLElement;
}

// Карточки (только render, без состояния в презентере)
export interface ICardPreview {
  render(data: TCardPreview): HTMLElement;
}

export interface ICardCatalogView {
  render(data: TCardCatalog): HTMLElement;
}

export interface ICardBasketView {
  render(data: TCardBasket): HTMLElement;
}
// --- Конструкторы карточек ---
export interface ICardCatalogConstructor {
  new (container: HTMLElement, actions: ICardActions): ICardCatalogView;
}

export interface ICardBasketConstructor {
  new (container: HTMLElement, actions: ICardActions): ICardBasketView;
}
