import createElement from '../assets/lib/create-element.js';

export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.container = createElement(`
      <div class="card">
        <div class="card__top">
          <img class="card__image" alt="product">
          <span class="card__price">€</span>
        </div>
        <div class="card__body">
          <div class="card__title">NAME</div>
          <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `);

    this.fillCard();
    this.addProduct();
  }

  fillCard() {
    this.container.querySelector('img.card__image').src = `./assets/images/products/${this.product.image}`;
    this.container.querySelector('span.card__price').innerHTML = `€${this.product.price.toFixed(2)}`;
    this.container.querySelector('div.card__title').innerHTML = `${this.product.name}`;
  }

  addProduct() {
    this.container.addEventListener('product-add', event => {
      console.log(event.detail, 'добавлен в корзину');
    });

    this.container.addEventListener('click', event => {
      if (!event.target.closest('button.card__button')) return;

      this.container.dispatchEvent(new CustomEvent('product-add', {
        detail: this.product.id,
        bubbles: true,
      }));
    });
  }

  get elem() {
    return this.container;
  }
}