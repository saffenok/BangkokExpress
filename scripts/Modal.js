import createElement from '../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this.wrapper = null;
    this.onKeydown = this.onKeydown.bind(this);

    this.render();
    this.initEventListeners();
  }

  render() {
    this.wrapper = createElement(`
      <div class="modal">
        <div class="modal__overlay"></div>
    
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
    
            <h3 class="modal__title">
              Вот сюда нужно добавлять заголовок
            </h3>
          </div>
    
          <div class="modal__body">
            A сюда нужно добавлять содержимое тела модального окна
          </div>
        </div>
      </div>
    `);
  }

  open() {
    document.body.append(this.wrapper);
    document.body.classList.add('is-modal-open');

    document.addEventListener('keydown', this.onKeydown);
  }

  setTitle(title) {
    let modalTitle = this.wrapper.querySelector('.modal__title');
    modalTitle.innerHTML = `${title}`;
  }

  setBody(node) {
    let modalBody = this.wrapper.querySelector('.modal__body');
    modalBody.innerHTML = node.outerHTML;
  }

  onKeydown(event) {
    if (event.code === 'Escape') {
      this.close();
    }
  }

  initEventListeners() {
    this.wrapper.addEventListener('click', event => {
      if (event.target.closest('.modal__close')) {
        this.close();
      }
    });
  }

  close() {
    this.wrapper.remove();
    let body = document.querySelector('body');
    body.classList.remove('is-modal-open');

    document.removeEventListener('keydown', this.onKeydown);
  }
}
