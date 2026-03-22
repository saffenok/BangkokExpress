import createElement from '../assets/lib/create-element.js';
import ProductCard from './ProductCard.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.container = null;

    this.render();
  }

  render() {
    this.container = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner">
        </div>
      </div>
    `);

    this.fillGrid(this.products);
  }

  fillGrid(products) {
    this.gridInner = this.container.querySelector('.products-grid__inner');
    this.gridInner.innerHTML = '';
    let productCard;
    for (let product of products) {
      productCard = new ProductCard(product);
      this.gridInner.append(productCard.elem);
    }
  }

  updateFilter(filters) {
    this.filters = {...this.filters, ...filters};

    let filteredProducts = this.products.filter(product => {
      if (this.filters.noNuts && product.nuts) return;
      if (this.filters.vegeterianOnly && !product.vegeterian) return;
      if (this.filters.maxSpiciness && (product.spiciness > this.filters.maxSpiciness)) return;
      if (this.filters.category && (product.category != this.filters.category)) return;
      return true;
    });
    this.fillGrid(filteredProducts);
  }

  get elem() {
    return this.container;
  }
}
