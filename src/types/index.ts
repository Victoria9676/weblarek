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
  onClick: (event: MouseEvent) => void;
}

export interface IFormState {
  valid: boolean;
  errors: string;
  payment: TPayment | "";
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

// --- View (интерфейсы, от которых зависит Presenter) ---
export interface IPageHeader {
  counter: number;
}

export interface IPageGallery {
  catalog: HTMLElement[];
}

export interface IModal {
  content: HTMLElement;
  open(): void;
  close(): void;
}

export interface IBasketView {
  items: HTMLElement[];
  total: number;
  isOrderButtonEnabled: boolean;
  render(): HTMLElement;
}

export interface IOrderView {
  payment: TPayment | "";
  address: string;
  valid: boolean;
  errors: string;
  render(): HTMLElement;
}

export interface IContactsView {
  email: string;
  phone: string;
  valid: boolean;
  errors: string;
  render(): HTMLElement;
}

export interface ISuccessView {
  render(data?: { total: number }): HTMLElement;
}

// Карточки (только render, без состояния в презентере)
export interface ICardPreview {
  render(data: TCardPreview): HTMLElement;
}
