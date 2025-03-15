export interface ICard {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}

export interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IOrderForm {
	payment: string;
	address: string;
}

export interface IOrder extends IContactsForm, IOrderForm {
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type TPayment = 'card' | 'cash' | '';
export type FormErrors = Partial<Record<keyof IOrder, string>>;
