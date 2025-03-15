# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Описание данных

Интерфейс карточки товара

```
interface ICard {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category: string;
	price: number | null;
}
```

Интерфейс для модели данных

```
 interface IAppState {
	catalog: ICard[];
	basket: string[];
	preview: string | null;
	order: IOrder | null;
}
```

Интерфейс определяет структуру данных для отображения корзины на странице.

```
interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}
```

Интерфейс для формы ввода контактных данных пользователя

```
interface IContactsForm {
  email: string;
  phone: string;
}
```

Интерфейс для формы выбора способа оплаты и ввода адреса

```
IPaymentForm {
  payment: string;
  adress: string;
}
```

Интерфейс содержащий данные заказа, включая контактную информацию, способ оплаты и адрес доставки, а также общую сумму и список товаров.

```
interface IOrder extends IContactsForm, IOrderForm {
	total: number;
	items: string[];
}
```

Интерфейс с описанием структуры данных для ответа от API после оформления заказа.

```
interface IOrderResult {
  id: string;
  total: number;
}
```

Тип для хранения ошибок в формах заказа и контактных данных.

```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api

Класс для работы с API, поддерживает запросы GET и POST (включая PUT и DELETE).

Свойства:

- **`baseUrl`**: Базовый URL для запросов.
- **`options`**: Опции запроса, включая заголовки.

Методы:

- **`constructor(baseUrl: string, options: RequestInit = {})`**: Инициализация с базовым URL.
- **`handleResponse(response: Response)`**: Обработка ответа от сервера.
- **`get(uri: string)`**: Выполнение GET-запроса.
- **`post(uri: string, data: object, method: ApiPostMethods = 'POST')`**: Выполнение POST-запроса.

Типы:

- **`ApiListResponse<Type>`**: Ответ с количеством элементов и данными.
- **`ApiPostMethods`**: Типы HTTP-методов: `'POST'`, `'PUT'`, `'DELETE'`.

#### класс EventEmitter

Реализация брокера событий, позволяющая подписываться на события, инициировать их и управлять обработчиками.

Свойства:

- **`_events`**: Хранит события и подписчиков в виде карты, где ключ — это имя события или регулярное выражение, а значение — множество подписчиков.

Методы:

### `on<T extends object>(eventName: EventName, callback: (event: T) => void)`

Подписывается на событие и добавляет обработчик.

### `off(eventName: EventName, callback: Subscriber)`

Удаляет обработчик с события.

`emit<T extends object>(eventName: string, data?: T)`

Инициирует событие с переданными данными.

`onAll(callback: (event: EmitterEvent) => void)`

Подписывается на все события.

`offAll()`

Удаляет все обработчики событий.

`trigger<T extends object>(eventName: string, context?: Partial<T>)`

Создает коллбек, который генерирует событие при вызове.

## Типы:

- **`EventName`**: Имя события, может быть строкой или регулярным выражением.
- **`Subscriber`**: Подписчик на событие, представленный функцией.
- **`EmitterEvent`**: Событие с данными, содержащими имя события и саму информацию.

### Слой модель данных

#### Model



#### Класс AppState

Класс отвечает за хранение и логику работы с данными

### Слой представления

Все классы представления отвечают за отображение внутри контейнера (DOM - элемент) передаваемых в них данных.





#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображаемого модального окна.

- constructor(selector: string, events: IEvents) Конструктор принимает селектор модального окна и экземпляр класса `EventEmitter` для возможности иниацииции событий.

Поля класса:

- modal: HTMLElement - элемент модального окна.
- events: IEvents - брокер событий.

#### Класс Page

Отвечате за управление состоянием страницы, отображение корзины и подсчет товаров в ней. Предоставляет методы для блокировки и разблокировки страницы, а также для обновления отображаемого счетчика корзины. Класс взаимодействует с корзиной, передавая события через систему событийного брокера.

Поля класса:

- wrapper: HTMLElement - состояние обертки страницы.
- button: HTMLButtonElement - кнопка для открытия корзины.
- counter: HTMLSpanElement - счетчик товаров в корзине.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- set isLocked(value: boolean) - блокирует или разблокирует страницу.
- set counter(value: number) - обновляет счетчик товаров в корзине.

#### Класс Success

#### Класс Card

#### Класс Page

#### Basket

#### Класс ContactsForm

Класс реализует работу с формой контактов

В полях класса хранятся следующие данные:

- emailInput: HTMLInputElement - поле для ввода email.
- phoneInput: HTMLInputElement - поле для ввода имени.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- set phone(value: string) - устанавливает имя.
- set email(value: string) - устанавливает email.

#### Классс PaymentForm

Класс реализует работу с формой оплаты.

В полях класса хранятся следующие данные:

- adressInput: HTMLInputElement - поле для ввода адреса доставки.
- buttonCardButton: HTMLButtonElement - кнопка для оплаты картой.
- buttonCashButton: HTMLButtonElement - кнопка для оплаты наличными.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- set adress(value: string) - устанавливает адрес доставки.
- set payment(value: TPayment) - устанавливает способ оплаты.

Класс предоставляет возможность взаимодействия с данными формы.

### Класс Success:

Класс реализует работу с формой успешного завершения заказа.

- total: HTMLParagraphElement - поле для отображения общей суммы заказа.

Так же класс предоставляет набор методов для взаимодействия с данными формы.

- set total(value: string) - устанавливает общую сумму заказа.

### Слой презентера

#### Класс WebLarekApi

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

- getCardList(): Promise<ICard[]> - получить данные по всем товарам
- orderCards(order: IOrder): Promise<IOrderResult> - отправить заказ

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.




Доку, я допишу после вашей проверки
