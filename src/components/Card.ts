import { Component } from './base/Component';
import { ICard } from '../types';
import { ensureElement, categoryClasses, Category } from '../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard> {
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._category = container.querySelector('.card__category');
		this._price = container.querySelector('.card__price');
		this._button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		this.setText(this._category, value);

		const categoryEnum = Object.values(Category).find(
			(category) => category.toLowerCase() === value.toLowerCase()
		);

		if (categoryEnum) {
			const categoryClass = categoryClasses[categoryEnum];
			this._category.classList.add(`card__category_${categoryClass}`);
		}
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	set price(value: string) {
		this.setText(this._price, value ? `${value} синапсов` : `Бесценно`);
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set button(value: string) {
		this.setText(this._button, value);
	}
}
