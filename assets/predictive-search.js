// Predictive Search JavaScript
class PredictiveSearch {
  constructor() {
    this.searchInput = document.querySelector('.search__input');
    this.predictiveSearch = document.querySelector('.predictive-search');
    this.searchForm = document.querySelector('.search-modal__form');
    
    if (this.searchInput && this.predictiveSearch) {
      this.init();
    }
  }

  init() {
    this.searchInput.addEventListener('input', this.debounce(this.handleInput.bind(this), 300));
    this.searchInput.addEventListener('focus', this.handleFocus.bind(this));
    this.searchInput.addEventListener('blur', this.handleBlur.bind(this));
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  handleInput(event) {
    const query = event.target.value.trim();
    
    if (query.length < 2) {
      this.hideResults();
      return;
    }

    this.showLoading();
    this.performSearch(query);
  }

  handleFocus() {
    if (this.searchInput.value.trim().length >= 2) {
      this.showResults();
    }
  }

  handleBlur() {
    // Delay hiding to allow clicking on results
    setTimeout(() => {
      this.hideResults();
    }, 200);
  }

  showLoading() {
    this.predictiveSearch.innerHTML = `
      <div class="predictive-search__loading-state">
        <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
        </svg>
      </div>
    `;
    this.showResults();
  }

  showResults() {
    this.predictiveSearch.style.display = 'block';
  }

  hideResults() {
    this.predictiveSearch.style.display = 'none';
  }

  async performSearch(query) {
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
      const data = await response.json();
      
      this.displayResults(data);
    } catch (error) {
      console.error('Search error:', error);
      this.hideResults();
    }
  }

  displayResults(data) {
    if (!data.resources || !data.resources.results || data.resources.results.products.length === 0) {
      this.hideResults();
      return;
    }

    const products = data.resources.results.products;
    const resultsHTML = products.map(product => `
      <div class="predictive-search__item" onclick="window.location.href='${product.url}'">
        <div class="predictive-search__item-content">
          <div class="predictive-search__item-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
          <div class="predictive-search__item-info">
            <div class="predictive-search__item-title">${product.title}</div>
            <div class="predictive-search__item-price">${product.price}</div>
          </div>
        </div>
      </div>
    `).join('');

    this.predictiveSearch.innerHTML = `
      <div class="predictive-search__results">
        ${resultsHTML}
      </div>
    `;
    
    this.showResults();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PredictiveSearch();
});
