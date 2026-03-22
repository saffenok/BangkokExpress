import createElement from '../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();

    this.elemY = null;
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, { once: true });

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetHeight) {
      return;
    }

    let pageY = window.pageYOffset;
    if (this.elemY == null) {
      this.elemY = this.elem.getBoundingClientRect().top + pageY;
    }

    if (document.documentElement.clientWidth > 767) {
      if (pageY > this.elemY) {
        this.elem.style.position = 'fixed';
        this.elem.style.top = '50px';
        let container = document.querySelector('.container');
        let left1 = container.getBoundingClientRect().right + 20;
        let left2 = document.documentElement.clientWidth - this.elem.offsetWidth - 10;
        let minLeft = Math.min(left1, left2);
        this.elem.style.left = `${minLeft}px`;
      } else {
        this.elem.style.position = 'absolute';
        this.elem.style.left = '';
      }
    }
  }
}
