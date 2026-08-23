import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { IProduct } from './types';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

const items = apiProducts.items as IProduct[];

// Каталог товаров
const catalog = new Catalog();
catalog.setProducts(items);
console.log('Все товары в каталоге:', catalog.getProducts());
console.log('Товар в каталоге по id:', catalog.getProduct(items[0].id));
catalog.setSelectedProduct(items[0]);
console.log('Выбранный товар в каталоге:', catalog.getSelectedProduct());

// Корзина 
const basket = new Basket();
basket.addItem(items[0]);
basket.addItem(items[1]);
console.log('Товары в корзине:', basket.getItems());
console.log('Количество товаров в корзине:', basket.getCount());
console.log('Сумма товаров в корзине:', basket.getTotal());
console.log('Корзина — есть первый товар?:', basket.hasItem(items[0].id));
basket.removeItem(items[0]);
console.log('Корзина после удаления первого:', basket.getItems());
basket.clear();
console.log('Корзина после очистки:', basket.getItems());

// Покупатель
const buyer = new Buyer();
buyer.setData({ payment: 'Безналичная оплата', address: 'Санкт-Петербург, Русановская ул., 20к1' });
console.log('Покупатель — сохранены оплата и адрес:', buyer.getData());
console.log('Покупатель — ошибки валидации (нет почты и телефона):', buyer.validate());
buyer.setData({ email: 'test@example.com', phone: '+79999999999' });
console.log('Покупатель — все поля заполнены:', buyer.getData());
console.log('Покупатель — ошибки валидации (ошибок нет):', buyer.validate());
buyer.clear();
console.log('Покупатель — после очистки:', buyer.getData());

// Запрос товаров с сервера
const api = new Api(API_URL);
const larekApi = new LarekApi(api);
larekApi
    .getProducts()
    .then((data) => {
        catalog.setProducts(data.items);
        console.log('Каталог с сервера:', catalog.getProducts());
    })
    .catch((error) => console.error('Ошибка загрузки товаров:', error));