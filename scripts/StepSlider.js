import createElement from '../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.wrapper = null;
    this.currentValue = -1;
    this.selectedValue = value;
    this.isDragging = false;

    this.render();
    this.initEventListeners();
  }

  render() {
    this.wrapper = createElement(`
      <div class="slider">

        <div class="slider__thumb" style="left: ${this.value / (this.steps - 1) * 100}%;">
          <span class="slider__value">${this.value}</span>
        </div>

        <div class="slider__progress" style="width: ${this.value / (this.steps - 1) * 100}%;"></div>

        <div class="slider__steps">
        </div>
      </div>
    `);
    this.renderSteps();
  }

  renderSteps() {
    let sliderSteps = this.wrapper.querySelector('.slider__steps');
    let sliderSpan;
    for (let i = 0; i < this.steps; i++) {
      if (i == this.value) {
        sliderSpan = createElement(`<span data-id=${i} class="slider__step-active"></span>`);
      } else {
        sliderSpan = createElement(`<span data-id=${i}></span>`);
      }
      sliderSteps.append(sliderSpan);
    }
  }

  initEventListeners() {
    this.wrapper.addEventListener('click', this.onClick);

    this.thumb = this.wrapper.querySelector('.slider__thumb');
    this.thumb.addEventListener('pointerdown', this.onPointerDown);
    this.thumb.ondragstart = () => false;
  }

  onClick = event => {
    if (this.isDragging) {
      this.isDragging = false;
      return;
    }

    this.sliderLeft = this.wrapper.getBoundingClientRect().left;
    this.sliderRight = this.wrapper.getBoundingClientRect().right;

    this.selectedValue = this.valueCalculation(event.clientX);
    this.changeValue(this.selectedValue);
    this.finalRepositioning(this.selectedValue);

    this.createNewCustomEvent(this.selectedValue);
  }

  onPointerDown = (event) => {
    event.preventDefault();
    this.isDragging = true;
    this.wrapper.classList.add('slider_dragging');

    this.sliderLeft = this.wrapper.getBoundingClientRect().left;
    this.sliderRight = this.wrapper.getBoundingClientRect().right;

    this.shiftX = event.clientX - this.thumb.getBoundingClientRect().left;
    this.progress = this.wrapper.querySelector('.slider__progress');

    this.moveAt(event.clientX);

    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('pointerup', this.onPointerUp);
  }

  moveAt = clientX => {
    if (clientX < this.sliderLeft) {
      clientX = this.sliderLeft;
    }
    if (clientX > this.sliderRight) {
      clientX = this.sliderRight;
    }
    let left = clientX - this.sliderLeft;
    if (left < 0) {
      left = 0;
    }
    if (left > this.wrapper.offsetWidth) {
      left = this.wrapper.offsetWidth;
    }

    this.thumb.style.left = `${left / this.wrapper.offsetWidth * 100}%`;
    this.progress.style.width = this.thumb.style.left;

    this.selectedValue = this.valueCalculation(clientX);
    this.changeValue(this.selectedValue);
  }

  onPointerMove = (event) => {
    event.preventDefault();

    let eventClientX = event.clientX;
    this.moveAt(eventClientX);
  }

  onPointerUp = () => {
    this.createNewCustomEvent(this.selectedValue);

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);

    this.wrapper.classList.remove('slider_dragging');

    setTimeout(() => {
      this.isDragging = false;
    }, 100);
  }

  valueCalculation = eventClientX => {
    let sliderWidth = this.wrapper.offsetWidth || this.lastSliderWidth || 1;
    this.lastSliderWidth = sliderWidth;

    let clickX = eventClientX - this.sliderLeft;
    let leftRelative = clickX / sliderWidth;
    let approximateValue = leftRelative * (this.steps - 1);
    let selectedValue = Math.round(approximateValue);

    return selectedValue;
  }

  changeValue(currentValue) {
    let sliderValue = this.wrapper.querySelector('.slider__value');
    sliderValue.innerHTML = currentValue;

    let sliderSteps = this.wrapper.querySelector('.slider__steps');
    let allSpans = sliderSteps.querySelectorAll('span');
    allSpans.forEach(span => {
      span.classList.remove('slider__step-active');
    });
    allSpans[currentValue].classList.add('slider__step-active');
  }

  finalRepositioning(currentValue) {
    let thumb = this.wrapper.querySelector('.slider__thumb');
    let progress = this.wrapper.querySelector('.slider__progress');

    thumb.style.left = `${currentValue / (this.steps - 1) * 100}%`;
    progress.style.width = `${currentValue / (this.steps - 1) * 100}%`;
  }

  createNewCustomEvent(currentValue) {
    this.wrapper.dispatchEvent(new CustomEvent('slider-change', {
      detail: currentValue,
      bubbles: true,
    }));
  }

  get elem() {
    return this.wrapper;
  }
}
