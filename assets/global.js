/**
 * &home - 家具ECサイトのグローバルJavaScript
 */

class AndHomeTheme {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
  }

  setupEventListeners() {
    // モーダルの開閉
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-toggle]')) {
        this.toggleModal(e.target);
      }
      
      if (e.target.matches('[data-modal-close]')) {
        this.closeModal(e.target.closest('.modal'));
      }
    });

    // カートの更新
    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-cart-update]')) {
        this.updateCart(e.target);
      }
    });

    // 商品の追加
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-product-form]')) {
        e.preventDefault();
        this.addToCart(e.target);
      }
    });

    // 検索の実行
    document.addEventListener('submit', (e) => {
      if (e.target.matches('[data-search-form]')) {
        this.handleSearch(e.target);
      }
    });
  }

  initializeComponents() {
    // スムーススクロール
    this.initSmoothScroll();
    
    // 画像の遅延読み込み
    this.initLazyLoading();
    
    // アニメーション
    this.initAnimations();
  }

  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  initAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      });

      document.querySelectorAll('[data-animate]').forEach(element => {
        animationObserver.observe(element);
      });
    }
  }

  toggleModal(trigger) {
    const modalId = trigger.dataset.modalToggle;
    const modal = document.getElementById(modalId);
    
    if (modal) {
      modal.classList.toggle('is-open');
      document.body.classList.toggle('modal-open');
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }
  }

  async updateCart(input) {
    const form = input.closest('form');
    const formData = new FormData(form);
    
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const cart = await response.json();
        this.updateCartUI(cart);
      }
    } catch (error) {
      console.error('カートの更新に失敗しました:', error);
    }
  }

  async addToCart(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    
    // ローディング状態
    submitButton.textContent = '追加中...';
    submitButton.disabled = true;
    
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        this.showNotification('商品をカートに追加しました', 'success');
        this.updateCartCount();
      } else {
        throw new Error('商品の追加に失敗しました');
      }
    } catch (error) {
      console.error('商品の追加に失敗しました:', error);
      this.showNotification('商品の追加に失敗しました', 'error');
    } finally {
      // ボタンを元の状態に戻す
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  handleSearch(form) {
    const searchInput = form.querySelector('input[name="q"]');
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
      this.showNotification('検索キーワードを2文字以上入力してください', 'warning');
      return;
    }
    
    // 検索結果ページに遷移
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }

  updateCartUI(cart) {
    // カートアイコンの更新
    const cartIcon = document.querySelector('#cart-icon-bubble');
    if (cartIcon) {
      const countElement = cartIcon.querySelector('.cart-count-bubble');
      if (countElement) {
        countElement.textContent = cart.item_count;
      }
    }
    
    // カートドロワーの更新（もしあれば）
    const cartDrawer = document.querySelector('[data-cart-drawer]');
    if (cartDrawer) {
      this.updateCartDrawer(cart);
    }
  }

  updateCartCount() {
    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        this.updateCartUI(cart);
      })
      .catch(error => {
        console.error('カート情報の取得に失敗しました:', error);
      });
  }

  updateCartDrawer(cart) {
    // カートドロワーの内容を更新
    const cartItems = document.querySelector('[data-cart-items]');
    if (cartItems) {
      cartItems.innerHTML = this.renderCartItems(cart.items);
    }
    
    const cartTotal = document.querySelector('[data-cart-total]');
    if (cartTotal) {
      cartTotal.textContent = this.formatMoney(cart.total_price);
    }
  }

  renderCartItems(items) {
    if (items.length === 0) {
      return '<p>カートは空です</p>';
    }
    
    return items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item__image">
        <div class="cart-item__details">
          <h3 class="cart-item__title">${item.title}</h3>
          <p class="cart-item__price">${this.formatMoney(item.price)}</p>
          <p class="cart-item__quantity">数量: ${item.quantity}</p>
        </div>
      </div>
    `).join('');
  }

  formatMoney(cents) {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(cents / 100);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // スタイルを追加
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 2rem',
      borderRadius: '4px',
      color: 'white',
      fontWeight: '600',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    // タイプに応じて背景色を設定
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // アニメーション
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自動で削除
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// DOMが読み込まれたら初期化
document.addEventListener('DOMContentLoaded', () => {
  new AndHomeTheme();
});

// グローバルに公開
window.AndHomeTheme = AndHomeTheme;
