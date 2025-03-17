import './scss/styles.scss';
import { Success } from './components/common/Success';
import { Page } from './components/Page';
import { API_URL, CDN_URL } from './utils/constants';
import { WebLarekApi } from './components/WebLarekApi';
import { AppState, CatalogChangeEvent } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Card } from './components/Card';
import { OrderForm } from './components/PaymentForm';
import { ICard, IContactsForm, IOrderForm } from './types';
import { ContactsForm } from './components/ContactsForm';

const events = new EventEmitter();
const api = new WebLarekApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобалньые контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);

const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
		});
	});
});

// Отправлена форма заказа
events.on('contacts:submit', () => {
	const payload = {
		...appData.getOrder(),
		total: appData.getTotal(),
		items: appData.getIds(),
	};

	api
		.orderCards(payload)
		.then((result) => {
			modal.render({
				content: success.render({
					total: result.total,
				}),
			});

			appData.clearAllCardsInBasket();
			appData.clearInputs();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IContactsForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// изменилось одно из полей
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IContactsForm; value: string }) => {
		appData.setContactsField(data.field, data.value);
	}
);

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setPaymentField(data.field, data.value);
	}
);

events.on('order:ready', () => {
	order.payment = appData.order.payment;
});

// Открыть форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму контактов
events.on('order:submit', () => {
	appData.basket.map((item) => item.id);
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

// Открыть товар
events.on('card:select', (item: ICard) => {
	appData.setPreview(item);
});

// Добавить товар в корзину и удаление в корзину
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.CardInBasket(item)) {
				events.emit('card:add', item);
				card.button = 'Удалить из корзины';
			} else {
				events.emit('card:remove', item);
				card.button = 'В корзину';
			}
		},
	});

	card.button = appData.CardInBasket(item) ? 'Удалить из корзины' : 'В корзину';
	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

// Изменилась корзина
events.on('basket:changed', () => {
	page.counter = appData.basket.length;

	basket.items = appData.basket.map((item) => {
		const product = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('card:remove', item);
			},
		});
		return product.render({
			title: item.title,
			price: item.price,
		});
	});
	basket.total = appData.getTotal();
	// appData.order.total = appData.getTotal();
});

// Добавляем товар в корзину
events.on('card:add', (item: ICard) => {
	appData.addBasket(item);
});

// Удаляем товар из корзины
events.on('card:remove', (item: ICard) => {
	appData.removeBasket(item);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем карточки товаров с сервера
api
	.getCardList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});
