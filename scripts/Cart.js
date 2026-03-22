import createElement from '../assets/lib/create-element.js';
import escapeHtml from '../assets/lib/escape-html.js';

import Modal from './Modal.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) return;

    let cartItem;
    let hasProduct = 0;
    for (let item of this.cartItems) {
      hasProduct++;
      // если этот товар уже есть
      if (item.product.id == product.id) {
        hasProduct = -1;
        item.count++;
        cartItem = item;
        break;
      }
    }
    // если этого товара нет, но есть другие, или корзина пустая
    if ((hasProduct != -1)) {
      cartItem = {
        product: product,
        count: 1,
      };
      this.cartItems.push(cartItem);
    }

    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem;
    for (let i = 0; i < this.cartItems.length; i++) {
      let item = this.cartItems[i];
      if (item.product.id == productId) {
        item.count += amount;
        if (!item.count) {
          this.cartItems.splice(i, 1);
        }
        cartItem = item;
        break;
      }
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    if (this.cartItems.length) return false;
    else return true;
  }

  getTotalCount() {
    let count = 0;
    for (let item of this.cartItems) {
      count += item.count;
    }
    return count;
  }

  getTotalPrice() {
    let price = 0;
    for (let item of this.cartItems) {
      price += item.product.price * item.count;
    }
    return price;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id
      }">
      <div class="cart-product__img">
        <img src="assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');

    let wrapper = createElement(`<div></div>`);
    for (let item of this.cartItems) {
      let productLayout = this.renderProduct(item.product, item.count);
      wrapper.append(productLayout);
    }
    let formLayout = this.renderOrderForm();
    wrapper.append(formLayout);
    this.modal.setBody(wrapper);

    this.modal.open();

    this.modal.wrapper.addEventListener('click', event => {
      let target = event.target.closest('.cart-counter__button');
      if (!target) return;

      let productId = target.closest('.cart-product').dataset.productId;
      let amount = target.classList.contains('cart-counter__button_minus') ? -1 : 1;

      this.updateProductCount(productId, amount);
    });

    let form = document.querySelector('.cart-form');
    form.addEventListener('submit', event => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);

    if (document.body.classList.contains('is-modal-open')) {
      if (this.isEmpty()) {
        this.modal.close();
        return;
      }
      let productId = cartItem.product.id;
      let modalBody = this.modal.wrapper;
      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let infoPrice = modalBody.querySelector('.cart-buttons__info-price');
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }
  }

  onSubmit(event) {
    event.preventDefault();
    let button = document.querySelector('button[type="submit"]');
    button.classList.add('is-loading');

    let form = document.querySelector('.cart-form');
    let fd = new FormData(form);

    return fetch('https://httpbin.org/post', {
      method: 'POST',
      body: fd,
    })
      .then((response) => {
        if (response.ok) {
          this.modal.setTitle('Success!');
          this.cartItems = [];
          this.modal.setBody(createElement(`
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We'll notify you about delivery time shortly.<br>
              <img src="../assets/images/delivery.gif">
            </p>
          </div>
        `));
        }
        return response;
      });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

