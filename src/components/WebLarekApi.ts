// import { Api, ApiListResponse } from './base/api';

import { ICard, IOrder, IOrderResult } from '../types';
import { Api, ApiListResponse } from './base/api';

export interface IWebLarekAPI {
	getCardList: () => Promise<ICard[]>;
	orderCards: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekApi extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCardList(): Promise<ICard[]> {
		return this.get('/product').then((data: ApiListResponse<ICard>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderCards(order: IOrder): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
