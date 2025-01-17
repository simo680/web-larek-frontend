export type TPayment = 'card' | 'cash' | undefined;

export interface ICard {
	id: string;
	description?: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface ICardsData {
	cards: ICard[];
	setCards(cards: ICard[]): void;
	getCard(id: string): ICard | undefined;
}

export interface IContactsForm {
	email: string;
	phone: string;
}

export interface IPaymentForm {
	payment: TPayment;
	adress: string;
	
}

export interface ICart {
	product: ICard;
	id: string;
	total: number;
}

export interface ICartData {
	cart: ICart[];
	addProduct(id: string): void;
	removeProduct(id: string): void;
	getProduct(): ICard[];
	clearCart(): void;
}

// export interface IEventEmitter {
// 	emit: (event: string, data: unknown) => void;
// }

// export interface IViewConstructor {
// 	new (container: HTMLElement, events?: IEventEmitter): IView;
// }

// export interface IView {
// 	render(data?: object): HTMLElement;
// }
