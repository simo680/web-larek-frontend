import {
	FormErrors,
	IAppState,
	ICard,
	IContactsForm,
	IOrder,
	IOrderForm,
} from '../types';
import { Model } from './base/Model';

export type CatalogChangeEvent = {
	catalog: ICard[];
};

export class AppState extends Model<IAppState> {
	basket: ICard[] = [];
	catalog: ICard[];
	order: IOrder = {
		email: '',
		phone: '',
		payment: '',
		address: '',
		total: 0,
		items: [],
	};
	preview: string | null;
	formErrors: FormErrors = {};

	removeBasket(item: ICard) {
		this.basket = this.basket.filter((card) => card.id !== item.id);
		this.emitChanges('basket:changed', this.basket);
	}

	addBasket(item: ICard) {
		this.basket.push(item);
		this.emitChanges('basket:changed', this.basket);
	}

	clearAllCardsInBasket() {
		this.basket = [];
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	CardInBasket(item: ICard) {
		return this.basket.some((card) => card.id === item.id);
	}

	getTotal() {
		return this.basket.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c.id).price,
			0
		);
	}

	setCatalog(items: ICard[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	clearInputs() {
		this.order = {
			email: '',
			phone: '',
			payment: '',
			address: '',
			total: 0,
			items: [],
		};
		this.emitChanges('order:changed', this.order);
	}

	setPaymentField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;
		this.validatePayment()
		this.events.emit('order:ready');
	}

	setContactsField(field: keyof IContactsForm, value: string) {
		this.order[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validatePayment() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: FormErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
