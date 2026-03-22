import createElement from '../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.container = null;
    this.currentCategory = null;

    this.render();
    this.initEventListeners();
  }

  render() {
    this.container = createElement(`
      <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="../assets/images/icons/angle-icon.svg" alt="icon">
      </button>

      <nav class="ribbon__inner">
        ${this.categories.map(category => this.renderCatogory(category)).join('')}
      </nav>

      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="../assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      </div>
    `);
  }

  renderCatogory(category) {
    return `
      <a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>
    `
  }

  initEventListeners() {
    this.container.addEventListener('click', event => {
      if (event.target.closest('.ribbon__arrow'))
        this.arrowClick(event);
      if (event.target.closest('.ribbon__item'))
        this.categoryClick(event);
    })

    let ribbonInner = this.container.querySelector('.ribbon__inner');
    ribbonInner.addEventListener('scroll', () => {
      this.arrowVisible();
    })

    this.container.addEventListener('ribbon-select', event => {
      console.log(event.detail, 'выбран');
    });
  }

  arrowClick(event) {
    let ribbonInner = this.container.querySelector('.ribbon__inner');
    if (event.target.closest('.ribbon__arrow_right')) {
      ribbonInner.scrollBy(350, 0);
    }
    if (event.target.closest('.ribbon__arrow_left')) {
      ribbonInner.scrollBy(-350, 0);
    }
  }

  arrowVisible() {
    let ribbonInner = this.container.querySelector('.ribbon__inner');
    let arrowLeft = this.container.querySelector('.ribbon__arrow.ribbon__arrow_left');
    let arrowRight = this.container.querySelector('.ribbon__arrow.ribbon__arrow_right');

    let scrollLeft = ribbonInner.scrollLeft;
    let scrollWidth = ribbonInner.scrollWidth;
    let clientWidth = ribbonInner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;

    if (!scrollLeft) {
      arrowLeft.classList.remove('ribbon__arrow_visible');
    } else {
      arrowLeft.classList.add('ribbon__arrow_visible');
    }
    if (scrollRight < 1) {
      arrowRight.classList.remove('ribbon__arrow_visible');
    } else {
      arrowRight.classList.add('ribbon__arrow_visible');
    }
  }

  categoryClick(event) {
    event.preventDefault();
    if (this.currentCategory) {
      this.currentCategory.classList.remove('ribbon__item_active');
    }
    this.currentCategory = event.target.closest('.ribbon__item');
    this.currentCategory.classList.add('ribbon__item_active');

    this.container.dispatchEvent(new CustomEvent('ribbon-select', {
      detail: this.currentCategory.dataset.id,
      bubbles: true,
    }));
  }


  get elem() {
    return this.container;
  }

}
