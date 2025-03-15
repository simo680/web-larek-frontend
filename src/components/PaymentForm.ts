import { Form } from './common/Form';
import { IOrderForm } from '../types/index';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class OrderForm extends Form<IOrderForm> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._card = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			container
		);
		this._cash = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			container
		);

		this._card.addEventListener('click', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = 'payment';
			const value = target.name;
			this.onInputChange(field, value);
		});

		this._cash.addEventListener('click', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = 'payment';
			const value = target.name;
			this.onInputChange(field, value);
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	protected onInputChange(field: keyof IOrderForm, value: string) {
		this.events.emit(`order.${field}:change`, {
			field,
			value,
		});
	}

	set payment(value: string) {
		this.toggleClass(
			this.container.elements.namedItem('card') as HTMLInputElement,
			'button_alt',
			(this.container.elements.namedItem('card') as HTMLInputElement).name !==
				value
		);
		this.toggleClass(
			this.container.elements.namedItem('cash') as HTMLInputElement,
			'button_alt',
			(this.container.elements.namedItem('cash') as HTMLInputElement).name !==
				value
		);
	}
}
