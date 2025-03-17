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
interface IOrder extends IContactsForm, IOrderForm {}
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

Model<T> — это абстрактный класс, служащий базой для моделей. Он позволяет отличать модели от обычных объектов и добавляет поддержку событий.

Методы:

emitChanges(event: string, payload?: object)

Вызывает событие с указанным именем и передает данные подписчикам.

    event — строка, имя события.
    payload (опционально) — объект с данными события. Если не передан, отправляется пустой объект {}.

#### Класс AppState

Класс AppState управляет состоянием приложения, связанным с каталогом товаров, корзиной, заказом и обработкой формы. Он расширяет базовый класс Model, предоставляя методы для изменения состояния и оповещения подписчиков об изменениях.

Свойства:

basket: ICard[] — массив товаров в корзине.

catalog: ICard[] — массив доступных товаров в каталоге.

order: IOrder — объект текущего заказа, содержащий информацию о покупателе и товарах.

preview: string | null — ID товара, выбранного для предпросмотра.

formErrors: FormErrors — объект, содержащий ошибки валидации формы.

Методы:

- getOrder(): IOrder

Возвращает объект текущего заказа.

- getIds(): string[]

Возвращает массив ID товаров в корзине.

- removeBasket(item: ICard)

Удаляет товар из корзины по его id.

- addBasket(item: ICard)

Добавляет товар в корзину и оповещает подписчиков об изменении.

- clearAllCardsInBasket()

Очищает корзину и отправляет соответствующие события об изменении состояния.

- CardInBasket(item: ICard): boolean

Проверяет, находится ли товар в корзине.

- getTotal(): number

Возвращает общую сумму товаров в корзине, основываясь на ценах из каталога.

- setCatalog(items: ICard[])

Устанавливает список товаров каталога и отправляет событие обновления.

- setPreview(item: ICard)

Устанавливает ID товара для предпросмотра и отправляет соответствующее событие.

- clearInputs()

Сбрасывает данные заказа и отправляет событие order:changed.

- setPaymentField(field: keyof IOrderForm, value: string)

Изменяет поле, связанное с оплатой, проверяет корректность данных и отправляет событие order:ready.

- setContactsField(field: keyof IContactsForm, value: string)

Изменяет поле контактов, проверяет корректность данных и, если данные валидны, отправляет событие contacts:ready.

- validatePayment(): boolean

Проверяет корректность заполнения данных об оплате, обновляет объект formErrors и отправляет событие formErrors:change. Возвращает true, если ошибок нет.

- validateContacts(): boolean

Проверяет корректность контактных данных, обновляет formErrors и отправляет событие formErrors:change. Возвращает true, если ошибок нет.

### Слой представления

Все классы представления отвечают за отображение внутри контейнера (DOM - элемент) передаваемых в них данных.

#### Класс Component

Component<T> — это абстрактный базовый класс для создания UI-компонентов, предоставляющий методы для работы с DOM.

Поля класса

container: HTMLElement — корневой HTML-элемент компонента.

Методы:

Переключает CSS-класс у элемента.

- toggleClass(element: HTMLElement, className: string, force?: boolean)

Устанавливает текстовое содержимое элемента.

- setText(element: HTMLElement, value: unknown)

Добавляет или убирает атрибут disabled у элемента.

- setDisabled(element: HTMLElement, state: boolean)

Скрывает элемент (display: none).

- setHidden(element: HTMLElement)

Показывает скрытый элемент (удаляет display: none).

- setVisible(element: HTMLElement)

Устанавливает изображение и альтернативный текст.

- setImage(element: HTMLImageElement, src: string, alt?: string)

Обновляет данные компонента и возвращает его контейнер.

- render(data?: Partial<T>): HTMLElement

#### Класс Modal

Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображаемого модального окна.

- constructor(selector: string, events: IEvents) Конструктор принимает селектор модального окна и экземпляр класса `EventEmitter` для возможности иниацииции событий.

Поля класса:

- container: HTMLElement - элемент модального окна.
- events: IEvents - брокер событий.

#### Класс Page

Отвечате за управление состоянием страницы, отображение корзины и подсчет товаров в ней. Предоставляет методы для блокировки и разблокировки страницы, а также для обновления отображаемого счетчика корзины. Класс взаимодействует с корзиной, передавая события через систему событийного брокера.

Поля класса:

- wrapper: HTMLElement - состояние обертки страницы.
- button: HTMLButtonElement - кнопка для открытия корзины.
- counter: HTMLSpanElement - счетчик товаров в корзине.

Методы:

- set isLocked(value: boolean) - блокирует или разблокирует страницу.
- set counter(value: number) - обновляет счетчик товаров в корзине.

#### Класс Card

Card — это компонент, представляющий карточку товара с изображением, описанием, категорией и кнопкой взаимодействия.

Поля класса:

- \_description?: HTMLElement — элемент с текстовым описанием.

- \_image?: HTMLImageElement — элемент изображения товара.

- \_title: HTMLElement — заголовок карточки товара.

- \_category: HTMLElement — категория товара.

- \_price: HTMLElement — цена товара.

- \_button: HTMLButtonElement — кнопка действия.

- \_index: HTMLElement — индекс товара в списке.

Методы:

Устанавливает идентификатор карточки в data-id атрибут контейнера.

- set id(value: string)

Возвращает идентификатор карточки из data-id атрибута контейнера.

- get id(): string

Устанавливает заголовок карточки.

- set title(value: string)

Возвращает заголовок карточки.

- get title(): string

Устанавливает изображение карточки.

- set image(value: string)

Устанавливает текстовое описание карточки. Если передан массив строк, каждая строка создаёт отдельный элемент.

- set description(value: string | string[])

Устанавливает категорию товара и добавляет соответствующий класс в зависимости от категории.

- set category(value: string)

Устанавливает индекс товара в списке.

- set index(value: string)

Устанавливает цену товара. Если цена не указана, устанавливается Бесценно.

- set price(value: string)

Возвращает текстовое представление цены.

- get price(): string

Устанавливает текст кнопки действия.

- set button(value: string)

#### Класс Page

Page — это компонент, управляющий основными элементами страницы, включая каталог товаров и корзину.

Поля класса:

- \_counter: HTMLElement — элемент счётчика товаров в корзине.

- \_catalog: HTMLElement — контейнер каталога товаров.

- \_wrapper: HTMLElement — основной контейнер страницы.

- \_basket: HTMLElement — кнопка открытия корзины.

Методы:

Устанавливает значение счётчика товаров в корзине.

- set counter(value: number)

Заменяет содержимое каталога переданными элементами.

- set catalog(items: HTMLElement[])

Блокирует или разблокирует страницу, добавляя/удаляя класс page\_\_wrapper_locked.

- set locked(value: boolean)

#### Класс Basket

Это компонент, который управляет отображением списка товаров в корзине и общей стоимости.

Поля класса:

- \_list: HTMLElement — контейнер списка товаров.

- \_total: HTMLElement — элемент для отображения общей стоимости.

- \_button: HTMLElement — кнопка оформления заказа.

Методы:

Обновляет список товаров в корзине и управляет кнопкой оформления.

- set items(items: HTMLElement[])

Активирует или деактивирует кнопку оформления в зависимости от наличия выбранных товаров.

- set selected(items: string[])

Обновляет отображение общей стоимости товаров в корзине.

- set total(total: number)

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

#### Класс Success

Success — это компонент, который отображает сообщение об успешном заказе и позволяет закрыть уведомление.

Поля класса:

- \_close: HTMLElement — кнопка закрытия уведомления.

- \_description: HTMLElement — элемент с текстом суммы списанных средств.

Методы:

Устанавливает и отображает сумму списанных средств.

- set total(total: number)

### Слой презентера

#### Класс WebLarekApi

Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

- getCardList(): Promise<ICard[]> - получить данные по всем товарам
- orderCards(order: IOrder): Promise<IOrderResult> - отправить заказ

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление_

- 'items:changed' Изменение каталога товаров
- 'contacts:submit' Отправка формы контактов
- 'formErrors:change' - Изменение состояния валидации форм
- 'order:ready' Заказ готов к оформлению
- 'order:open' Открытие формы заказа
- 'order:submit' Открытие формы контактов при подтверждении заказа
- 'basket:open' Открытие корзины
- 'card:select' Выбор карточки для предпросмотра
- 'preview:changed' Изменение предпросмотра товара
- 'card:add' Добавление товара в корзину
- 'card:remove' Удаление товара из корзины
- 'basket:changed' Изменение состояния корзины
- 'modal:open' Открытие модального окна
- 'modal:close' Закрытие модального окна
