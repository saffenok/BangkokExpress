import createElement from '../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.wrapper = null;
    this.clickCounter = 0;

    this.render();

    let carouselArrowLeft = this.wrapper.querySelector('.carousel__arrow.carousel__arrow_left');
    // скрыть стрелку для первого слайда
    if (this.clickCounter == 0) {
      carouselArrowLeft.style.display = 'none';
    }

    this.initEventListeners();
  }

  render() {
    this.wrapper = createElement(`
      <div class="carousel">
        <!--Кнопки переключения-->
        <div class="carousel__arrow carousel__arrow_right">
          <img src="../assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="../assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
        <div class="carousel__inner">
          ${this.slides.map(slide => this.renderSlide(slide)).join('')}
        </div>
      </div>
    `);
  }

  renderSlide(slide) {
    return `
      <div class="carousel__slide" data-id="${slide.id}">
          <img src="../assets/images/carousel/${slide.image}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${slide.price.toFixed(2)}</span>
            <div class="carousel__title">${slide.name}</div>
            <button type="button" class="carousel__button">
              <img src="../assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
      </div>
    `
  }

  initEventListeners() {
    this.wrapper.addEventListener('click', event => {
      if (event.target.closest('.carousel__arrow'))
        this.arrowClick(event);
      if (event.target.closest('.carousel__button'))
        this.buttonAddClick(event);
    });

    this.wrapper.addEventListener('product-add', event => {
      console.log(event.detail, 'добавлен в корзину');
    });
  }

  arrowClick(event) {
    let carouselInner = this.wrapper.querySelector('.carousel__inner');
    let carouselWidth = carouselInner.offsetWidth;

    // для правой стрелки
    if (event.target.closest('.carousel__arrow.carousel__arrow_right')) {
      this.clickCounter++;
      carouselInner.style.transform = `translateX(${-carouselWidth * this.clickCounter + "px"})`;
    }

    // для левой стрелки
    if (event.target.closest('.carousel__arrow.carousel__arrow_left')) {
      this.clickCounter--;
      carouselInner.style.transform = `translateX(${-carouselWidth * this.clickCounter + "px"})`;
    }

    // настройка видимости стрелок
    this.arrowVisible();
  }

  arrowVisible() {
    let carouselArrowLeft = this.wrapper.querySelector('.carousel__arrow.carousel__arrow_left');
    let carouselArrowRight = this.wrapper.querySelector('.carousel__arrow.carousel__arrow_right');
    let carouselSlides = this.wrapper.querySelectorAll('.carousel__slide');

    // скрыть стрелки для крайних слайдов
    if (this.clickCounter == 0) {
      carouselArrowLeft.style.display = 'none';
    } else if (this.clickCounter == (carouselSlides.length - 1)) {
      carouselArrowRight.style.display = 'none';
    } else {
      carouselArrowLeft.style.display = '';
      carouselArrowRight.style.display = '';
    }
  }

  buttonAddClick(event) {
    let slide = event.target.closest('div.carousel__slide');

    this.wrapper.dispatchEvent(new CustomEvent('product-add', {
      detail: slide.dataset.id,
      bubbles: true,
    }));
  }

  get elem() {
    return this.wrapper;
  }
}
