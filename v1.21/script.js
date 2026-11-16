(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  function formatEGP(amount) {
    return `${Number(amount).toFixed(2)} EGP`;
  }

  function variantKey(colorName, size) {
    return `${colorName}::${size}`;
  }

  function getVariantStock(product, colorName, size) {
    if (!product) return 0;
    if (product.variantStock && typeof product.variantStock === 'object') {
      const key = variantKey(colorName, size);
      if (key in product.variantStock) {
        return Math.max(0, Number(product.variantStock[key]) || 0);
      }
    }
    if (typeof product.stock === 'number') {
      return Math.max(0, Number(product.stock) || 0);
    }
    return 0;
  }

  function getTotalProductStock(product) {
    if (!product) return 0;
    const colors = product.colors || [];
    const sizes = product.sizes || [];
    if (!colors.length || !sizes.length) return 0;
    let total = 0;
    colors.forEach((c) => {
      sizes.forEach((s) => {
        total += getVariantStock(product, c.name, s);
      });
    });
    return total;
  }

  // ---------- Image fallbacks ----------
  const logoImg = $('#logoImg');
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      logoImg.hidden = true;
      $('#logoFallback').hidden = false;
    });
  }

  $$('.cat img').forEach((img) => {
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
  });
  const heroImg = $('#heroImg');
  if (heroImg) {
    heroImg.addEventListener('error', function () { this.style.display = 'none'; });
  }

  if ($('#year')) $('#year').textContent = new Date().getFullYear();

  // ---------- Toast ----------
  const toast = $('#toast');
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // ---------- Mobile menu ----------
  const nav = $('#nav');
  const menuToggle = $('#menuToggle');
  if (nav && menuToggle) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', false);
      }
    });
  }

  // ---------- Search ----------
  if ($('#searchForm')) {
    $('#searchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('#searchInput').value.trim();
      if (!q) return showToast('Type something to search');
      location.href = 'shop.html?q=' + encodeURIComponent(q);
    });
  }

  // ---------- Shared Product Storage ----------
  const DEFAULT_PRODUCTS = {
    'nike-pegasus': {
      category: 'Men',
      sub: 'Shoes',
      brand: 'Nike',
      name: 'Air Zoom Pegasus 41',
      price: 6800.00,
      desc: 'Responsive cushioning in the Pegasus provides an energized ride for everyday road running.',
      sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
      colors: [
        { name: 'Volt / Black', hex: '#c8ff00', img: 'images/hero-shoe.jpg' },
        { name: 'Triple Black', hex: '#111111', img: 'images/cat-men.jpg' },
        { name: 'Pure Platinum', hex: '#e5e5e5', img: 'images/cat-women.jpg' }
      ],
      variantStock: {
        'Volt / Black::US 8': 2,
        'Volt / Black::US 9': 4,
        'Volt / Black::US 10': 3,
        'Volt / Black::US 11': 0,
        'Volt / Black::US 12': 1,
        'Triple Black::US 8': 5,
        'Triple Black::US 9': 0,
        'Triple Black::US 10': 1,
        'Triple Black::US 11': 2,
        'Triple Black::US 12': 0,
        'Pure Platinum::US 8': 3,
        'Pure Platinum::US 9': 3,
        'Pure Platinum::US 10': 0,
        'Pure Platinum::US 11': 4,
        'Pure Platinum::US 12': 2
      }
    },
    'adidas-ultraboost': {
      category: 'Women',
      sub: 'Shoes',
      brand: 'Adidas',
      name: 'Ultraboost Light',
      price: 8500.00,
      desc: 'Experience epic energy with the lightest Ultraboost ever made, built for daily miles.',
      sizes: ['US 7', 'US 8', 'US 9', 'US 10'],
      colors: [
        { name: 'Core Black', hex: '#0a0a0a', img: 'images/cat-women.jpg' },
        { name: 'Cloud White', hex: '#f4f4f4', img: 'images/hero-shoe.jpg' }
      ],
      variantStock: {
        'Core Black::US 7': 3,
        'Core Black::US 8': 0,
        'Core Black::US 9': 2,
        'Core Black::US 10': 4,
        'Cloud White::US 7': 1,
        'Cloud White::US 8': 5,
        'Cloud White::US 9': 0,
        'Cloud White::US 10': 2
      }
    },
    'puma-velocity-hoodie': {
      category: 'Men',
      sub: 'Hoodies',
      brand: 'Puma',
      name: 'Velocity Training Hoodie',
      price: 3400.00,
      desc: 'Moisture-wicking fleece engineered for warmups, cooldowns, and everyday street comfort.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Obsidian', hex: '#181818', img: 'images/cat-men.jpg' },
        { name: 'Heather Grey', hex: '#9e9e9e', img: 'images/cat-kids.jpg' }
      ],
      variantStock: {
        'Obsidian::S': 0,
        'Obsidian::M': 0,
        'Obsidian::L': 0,
        'Obsidian::XL': 0,
        'Heather Grey::S': 0,
        'Heather Grey::M': 0,
        'Heather Grey::L': 0,
        'Heather Grey::XL': 0
      }
    },
    'ua-rush-leggings': {
      category: 'Women',
      sub: 'Leggings',
      brand: 'Under Armour',
      name: 'UA RUSH Compression Leggings',
      price: 3900.00,
      desc: 'Mineral-infused fabric reflects energy back into your muscles for harder, longer sessions.',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Midnight Black', hex: '#0a0a0a', img: 'images/cat-women.jpg' },
        { name: 'Crimson', hex: '#9e1b32', img: 'images/cat-accessories.jpg' }
      ],
      variantStock: {
        'Midnight Black::XS': 2,
        'Midnight Black::S': 4,
        'Midnight Black::M': 0,
        'Midnight Black::L': 3,
        'Crimson::XS': 0,
        'Crimson::S': 2,
        'Crimson::M': 5,
        'Crimson::L': 1
      }
    },
    'reebok-classic-kids': {
      category: 'Kids',
      sub: 'Shoes',
      brand: 'Reebok',
      name: 'Classic Leather Junior',
      price: 2950.00,
      desc: 'Soft garment leather upper and lightweight EVA midsole built for all-day playground durability.',
      sizes: ['US 4', 'US 5', 'US 6', 'US 7'],
      colors: [
        { name: 'Chalk White', hex: '#f4f4f4', img: 'images/cat-kids.jpg' },
        { name: 'Core Black', hex: '#111111', img: 'images/hero-shoe.jpg' }
      ],
      variantStock: {
        'Chalk White::US 4': 6,
        'Chalk White::US 5': 4,
        'Chalk White::US 6': 2,
        'Chalk White::US 7': 0,
        'Core Black::US 4': 3,
        'Core Black::US 5': 5,
        'Core Black::US 6': 0,
        'Core Black::US 7': 4
      }
    },
    'nike-brasilia-duffel': {
      category: 'Accessories',
      sub: 'Bags',
      brand: 'Nike',
      name: 'Brasilia 9.5 Training Duffel',
      price: 2100.00,
      desc: 'Durable water-resistant bottom with dedicated ventilated shoe compartment and zip pockets.',
      sizes: ['One Size'],
      colors: [
        { name: 'Black / White', hex: '#0a0a0a', img: 'images/cat-accessories.jpg' }
      ],
      variantStock: {
        'Black / White::One Size': 3
      }
    }
  };

  function normalizeProductStock(p) {
    if (!p.variantStock || typeof p.variantStock !== 'object') {
      const fallback = typeof p.stock === 'number' ? Math.max(0, p.stock) : 5;
      p.variantStock = {};
      (p.colors || []).forEach((c) => {
        (p.sizes || []).forEach((s) => {
          p.variantStock[variantKey(c.name, s)] = fallback;
        });
      });
    }
    return p;
  }

  function getProducts() {
    try {
      const saved = localStorage.getItem('kynetixProducts');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.values(parsed).forEach(normalizeProductStock);
        return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  }

  function saveProducts(productsObj) {
    try {
      localStorage.setItem('kynetixProducts', JSON.stringify(productsObj));
    } catch (e) {}
  }

  // ---------- Shopping bag ----------
  const drawer = $('#bagDrawer');
  const overlay = $('#overlay');
  let bag = [];
  try { bag = JSON.parse(localStorage.getItem('kynetixBag')) || []; } catch (e) { bag = []; }

  function saveBag() {
    try { localStorage.setItem('kynetixBag', JSON.stringify(bag)); } catch (e) {}
  }

  function getBagItemStock(item) {
    const products = getProducts();
    if (item.productId && products[item.productId] && item.color && item.size) {
      return getVariantStock(products[item.productId], item.color, item.size);
    }
    // Parse legacy format: "Product Name (Color, Size)"
    const match = (item.name || '').match(/^(.+?)\s*\(([^,]+),\s*([^)]+)\)$/);
    if (match) {
      const [, baseName, color, size] = match;
      const prod = Object.values(products).find((p) => p.name === baseName);
      if (prod) return getVariantStock(prod, color.trim(), size.trim());
    }
    return 0;
  }

  function getQtyInBagForVariant(productId, color, size, fallbackName) {
    return bag.reduce((sum, item) => {
      if (productId && item.productId === productId && item.color === color && item.size === size) {
        return sum + item.qty;
      }
      if (!item.productId && fallbackName && item.name === fallbackName) {
        return sum + item.qty;
      }
      return sum;
    }, 0);
  }

  function renderBag() {
    const wrap = $('#bagItems');
    if (!wrap) return;
    const count = bag.reduce((n, i) => n + i.qty, 0);
    const total = bag.reduce((n, i) => n + i.qty * i.price, 0);

    $('#bagCount').textContent = count;
    $('#bagCount').classList.toggle('has-items', count > 0);
    $('#bagTotal').textContent = formatEGP(total);

    if (!bag.length) {
      wrap.innerHTML = '<p class="empty">Your bag is empty.</p>';
      return;
    }
    wrap.innerHTML = bag.map((i, idx) => {
      const maxStock = getBagItemStock(i);
      const atLimit = i.qty >= maxStock;

      return `
      <div class="bag-item">
        <div>
          <h4>${i.name}</h4>
          <p>${formatEGP(i.price)} each</p>
          ${maxStock === 0
            ? '<p class="bag-soldout-note">Sold Out</p>'
            : `<p class="bag-stock-note">In stock (${i.color || ''} ${i.size || ''}): ${maxStock}</p>`}
          <div class="bag-qty-controls">
            <button type="button" data-dec="${idx}" aria-label="Decrease quantity">&minus;</button>
            <span>${i.qty}</span>
            <button type="button" data-inc="${idx}" ${atLimit ? 'disabled' : ''} aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" data-remove="${idx}">Remove</button>
      </div>`;
    }).join('');
  }

  if ($('#bagItems')) {
    $('#bagItems').addEventListener('click', (e) => {
      const removeIdx = e.target.dataset.remove;
      if (removeIdx !== undefined) {
        bag.splice(Number(removeIdx), 1);
        saveBag();
        renderBag();
        return;
      }

      const decIdx = e.target.dataset.dec;
      if (decIdx !== undefined) {
        const idx = Number(decIdx);
        if (bag[idx].qty > 1) {
          bag[idx].qty -= 1;
        } else {
          bag.splice(idx, 1);
        }
        saveBag();
        renderBag();
        return;
      }

      const incIdx = e.target.dataset.inc;
      if (incIdx !== undefined) {
        const idx = Number(incIdx);
        const item = bag[idx];
        const maxStock = getBagItemStock(item);

        if (maxStock <= 0) {
          showToast('This variant is sold out');
          return;
        }
        if (item.qty + 1 > maxStock) {
          showToast(`Only ${maxStock} left in stock for this option`);
          return;
        }
        item.qty += 1;
        saveBag();
        renderBag();
      }
    });
  }

  window.addToBag = function (item) {
    const products = getProducts();
    const prod = item.productId ? products[item.productId] : null;
    const maxStock = prod && item.color && item.size
      ? getVariantStock(prod, item.color, item.size)
      : getBagItemStock(item);

    if (maxStock <= 0) {
      showToast('This color & size is sold out');
      return;
    }

    const currentQty = getQtyInBagForVariant(item.productId, item.color, item.size, item.name);
    if (currentQty + 1 > maxStock) {
      showToast(`Cannot add more — only ${maxStock} in stock for ${item.color} (${item.size})`);
      return;
    }

    const found = bag.find((b) =>
      (b.productId && b.productId === item.productId && b.color === item.color && b.size === item.size) ||
      (!b.productId && b.name === item.name)
    );

    if (found) {
      found.qty += 1;
    } else {
      bag.push({
        productId: item.productId || null,
        color: item.color || '',
        size: item.size || '',
        name: item.name,
        price: item.price,
        qty: 1
      });
    }
    saveBag();
    renderBag();
    showToast(item.name + ' added to bag');
  };

  function openBag() {
    if (!drawer) return;
    renderBag();
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeBag() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
  }
  if ($('#bagBtn')) $('#bagBtn').addEventListener('click', openBag);
  if ($('#closeBag')) $('#closeBag').addEventListener('click', closeBag);
  if (overlay) overlay.addEventListener('click', closeBag);
  if ($('#checkoutBtn')) {
    $('#checkoutBtn').addEventListener('click', () => {
      showToast(bag.length ? 'Checkout coming soon' : 'Your bag is empty');
    });
  }
  renderBag();

  // ---------- Account modal ----------
  const authModal = $('#authModal');
  function openAuth() { if (authModal) { authModal.classList.add('is-open'); authModal.setAttribute('aria-hidden', 'false'); } }
  function closeAuth() { if (authModal) { authModal.classList.remove('is-open'); authModal.setAttribute('aria-hidden', 'true'); } }
  if ($('#accountBtn')) $('#accountBtn').addEventListener('click', openAuth);
  if ($('#closeAuth')) $('#closeAuth').addEventListener('click', closeAuth);
  if (authModal) authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuth(); });

  $$('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const login = tab.dataset.tab === 'login';
      $('#loginForm').hidden = !login;
      $('#signupForm').hidden = login;
    });
  });

  if ($('#loginForm')) {
    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      closeAuth();
      showToast('Welcome back!');
    });
  }
  if ($('#signupForm')) {
    $('#signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      closeAuth();
      showToast('Account created!');
    });
  }

  // ---------- Shop Catalog & Sidebar Filtering (shop.html) ----------
  if ($('#shopProductGrid')) {
    const productsObj = getProducts();
    const allProducts = Object.entries(productsObj).map(([id, p]) => ({ id, ...p }));
    const params = new URLSearchParams(window.location.search);

    const state = {
      categories: new Set(params.get('category') ? [params.get('category')] : []),
      subs: new Set(params.get('sub') ? [params.get('sub')] : []),
      brands: new Set(params.get('brand') ? [params.get('brand')] : []),
      sizes: new Set(),
      maxPrice: 15000,
      search: (params.get('q') || '').toLowerCase(),
      sort: 'featured'
    };

    if (state.search && $('#searchInput')) {
      $('#searchInput').value = params.get('q');
    }

    const uniqueCategories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
    const uniqueSubs = [...new Set(allProducts.map((p) => p.sub).filter(Boolean))];
    const uniqueBrands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))];
    const uniqueSizes = [...new Set(allProducts.flatMap((p) => p.sizes || []))];

    function renderCheckboxes(containerId, items, stateSet, type) {
      const wrap = $(containerId);
      if (!wrap) return;
      wrap.innerHTML = items.map((val) => `
        <label class="filter-check">
          <input type="checkbox" data-filter-type="${type}" value="${val}" ${stateSet.has(val) ? 'checked' : ''}>
          <span>${val}</span>
        </label>
      `).join('');
    }

    renderCheckboxes('#filterCategories', uniqueCategories, state.categories, 'categories');
    renderCheckboxes('#filterSubcategories', uniqueSubs, state.subs, 'subs');
    renderCheckboxes('#filterBrands', uniqueBrands, state.brands, 'brands');

    const sizeWrap = $('#filterSizes');
    if (sizeWrap) {
      sizeWrap.innerHTML = uniqueSizes.map((sz) => `
        <button type="button" class="filter-size-chip ${state.sizes.has(sz) ? 'is-active' : ''}" data-size-filter="${sz}">${sz}</button>
      `).join('');
    }

    function updateHeading() {
      const parts = [];
      if (state.categories.size) parts.push([...state.categories].join(', '));
      if (state.brands.size) parts.push([...state.brands].join(', '));
      if (state.subs.size) parts.push([...state.subs].join(', '));
      if (state.search) parts.push(`"${params.get('q')}"`);
      $('#shopHeading').textContent = parts.length ? parts.join(' • ') : 'All Products';
    }

    function renderShop() {
      updateHeading();

      let filtered = allProducts.filter((p) => {
        if (state.categories.size && !state.categories.has(p.category)) return false;
        if (state.subs.size && !state.subs.has(p.sub)) return false;
        if (state.brands.size && !state.brands.has(p.brand)) return false;
        if (state.sizes.size && !(p.sizes || []).some((s) => state.sizes.has(s))) return false;
        if (Number(p.price) > state.maxPrice) return false;
        if (state.search) {
          const hay = `${p.name} ${p.brand} ${p.category || ''} ${p.sub || ''} ${p.desc || ''}`.toLowerCase();
          if (!hay.includes(state.search)) return false;
        }
        return true;
      });

      if (state.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
      if (state.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
      if (state.sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

      $('#shopResultCount').textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;

      const grid = $('#shopProductGrid');
      if (!filtered.length) {
        grid.innerHTML = `
          <div class="empty-shop">
            <h3>No matching products</h3>
            <p style="color:var(--grey-600); margin-bottom:20px;">Try adjusting or clearing your active filters.</p>
            <button type="button" class="btn btn--black" id="emptyResetBtn">Reset Filters</button>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map((p) => {
        const totalStock = getTotalProductStock(p);
        const isSoldOut = totalStock <= 0;
        return `
        <article class="p-card ${isSoldOut ? 'is-sold-out' : ''}">
          <a href="product.html?id=${p.id}" class="p-card__img-wrap">
            <img src="${p.colors[0]?.img || ''}" alt="${p.name}" loading="lazy">
            ${p.category ? `<span class="p-card__badge">${p.category}</span>` : ''}
            ${isSoldOut ? `<span class="p-card__badge p-card__badge--soldout">Sold Out</span>` : ''}
          </a>
          <div class="p-card__body">
            <span class="p-card__brand">${p.brand}</span>
            <h3 class="p-card__title"><a href="product.html?id=${p.id}">${p.name}</a></h3>
            <div class="p-card__swatches">
              ${p.colors.map((c) => `<span class="p-card__dot" style="background:${c.hex};" title="${c.name}"></span>`).join('')}
            </div>
            <div class="p-card__foot">
              <span class="p-card__price">${formatEGP(p.price)}</span>
              <a href="product.html?id=${p.id}" class="btn-small">${isSoldOut ? 'Sold Out' : 'Select Options'}</a>
            </div>
          </div>
        </article>
      `;
      }).join('');
    }

    $('.shop-sidebar').addEventListener('change', (e) => {
      const type = e.target.dataset.filterType;
      if (!type) return;
      if (e.target.checked) state[type].add(e.target.value);
      else state[type].delete(e.target.value);
      renderShop();
    });

    if (sizeWrap) {
      sizeWrap.addEventListener('click', (e) => {
        const sz = e.target.dataset.sizeFilter;
        if (!sz) return;
        if (state.sizes.has(sz)) state.sizes.delete(sz);
        else state.sizes.add(sz);
        e.target.classList.toggle('is-active');
        renderShop();
      });
    }

    $('#filterMaxPrice').addEventListener('input', (e) => {
      state.maxPrice = Number(e.target.value);
      $('#maxPriceLabel').textContent = state.maxPrice;
      renderShop();
    });

    $('#shopSort').addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderShop();
    });

    function clearAllFilters() {
      state.categories.clear();
      state.subs.clear();
      state.brands.clear();
      state.sizes.clear();
      state.maxPrice = 15000;
      state.search = '';
      if ($('#searchInput')) $('#searchInput').value = '';
      $('#filterMaxPrice').value = 15000;
      $('#maxPriceLabel').textContent = '15000';
      $$('.shop-sidebar input[type="checkbox"]').forEach((cb) => (cb.checked = false));
      $$('.filter-size-chip').forEach((btn) => btn.classList.remove('is-active'));
      history.replaceState(null, '', 'shop.html');
      renderShop();
    }

    $('#clearFiltersBtn').addEventListener('click', clearAllFilters);
    $('#shopProductGrid').addEventListener('click', (e) => {
      if (e.target.id === 'emptyResetBtn') clearAllFilters();
    });

    if ($('#mobileFilterToggle')) {
      $('#mobileFilterToggle').addEventListener('click', () => {
        $('.shop-sidebar').classList.toggle('is-open');
      });
    }

    renderShop();
  }

  // ---------- Product Page Logic (product.html) ----------
  if ($('#prodTitle')) {
    const PRODUCTS = getProducts();
    const params = new URLSearchParams(window.location.search);
    const requestedId = params.get('id');
    const prodId = (requestedId && PRODUCTS[requestedId]) ? requestedId : Object.keys(PRODUCTS)[0];
    const product = PRODUCTS[prodId];

    let selectedColor = product.colors[0];
    let selectedSize = null;
    const totalStock = getTotalProductStock(product);
    const completelySoldOut = totalStock <= 0;

    document.title = `${product.name} | Kynetix Collective`;
    $('#prodBrand').textContent = `${product.brand}${product.category ? ' • ' + product.category : ''}`;
    $('#prodTitle').textContent = product.name;
    $('#prodPrice').textContent = formatEGP(product.price);
    $('#prodDesc').textContent = product.desc;

    const stockStatusEl = $('#prodStockStatus');
    const addToCartBtn = $('#addToCartBtn');

    function updateVariantAvailabilityUI() {
      if (!stockStatusEl || !addToCartBtn) return;

      if (completelySoldOut) {
        stockStatusEl.textContent = 'Sold Out';
        stockStatusEl.className = 'stock-status is-soldout';
        addToCartBtn.textContent = 'Sold Out';
        addToCartBtn.disabled = true;
        addToCartBtn.classList.add('is-disabled');
        return;
      }

      if (!selectedSize) {
        const colorTotal = product.sizes.reduce((sum, sz) => sum + getVariantStock(product, selectedColor.name, sz), 0);
        if (colorTotal <= 0) {
          stockStatusEl.textContent = `${selectedColor.name} — Sold Out in all sizes`;
          stockStatusEl.className = 'stock-status is-soldout';
          addToCartBtn.textContent = 'Sold Out';
          addToCartBtn.disabled = true;
          addToCartBtn.classList.add('is-disabled');
        } else {
          stockStatusEl.textContent = 'Select a size to check availability';
          stockStatusEl.className = 'stock-status';
          addToCartBtn.textContent = 'Add to Bag';
          addToCartBtn.disabled = false;
          addToCartBtn.classList.remove('is-disabled');
        }
        return;
      }

      const vStock = getVariantStock(product, selectedColor.name, selectedSize);
      if (vStock <= 0) {
        stockStatusEl.textContent = `${selectedColor.name} / ${selectedSize} — Sold Out`;
        stockStatusEl.className = 'stock-status is-soldout';
        addToCartBtn.textContent = 'Sold Out';
        addToCartBtn.disabled = true;
        addToCartBtn.classList.add('is-disabled');
      } else {
        stockStatusEl.textContent = `In Stock (${vStock} available in ${selectedColor.name}, ${selectedSize})`;
        stockStatusEl.className = 'stock-status is-instock';
        addToCartBtn.textContent = 'Add to Bag';
        addToCartBtn.disabled = false;
        addToCartBtn.classList.remove('is-disabled');
      }
    }

    function renderColors() {
      $('#selectedColorName').textContent = selectedColor.name;
      $('#prodImg').src = selectedColor.img;
      $('#prodImg').alt = `${product.name} - ${selectedColor.name}`;

      $('#colorOptions').innerHTML = product.colors.map((c, idx) => {
        const colorTotal = product.sizes.reduce((sum, sz) => sum + getVariantStock(product, c.name, sz), 0);
        return `
        <button type="button" 
                class="swatch ${c.name === selectedColor.name ? 'is-active' : ''} ${colorTotal <= 0 ? 'is-soldout' : ''}" 
                style="background-color: ${c.hex};" 
                data-color-idx="${idx}" 
                title="${c.name}${colorTotal <= 0 ? ' (Sold Out)' : ''}"
                aria-label="${c.name}"></button>
      `;
      }).join('');
    }

    function renderSizes() {
      $('#sizeOptions').innerHTML = product.sizes.map((size) => {
        const vStock = getVariantStock(product, selectedColor.name, size);
        const soldOut = vStock <= 0;
        return `
        <button type="button" 
                class="size-btn ${size === selectedSize ? 'is-active' : ''} ${soldOut ? 'is-soldout' : ''}" 
                data-size="${size}"
                title="${soldOut ? 'Sold Out' : `${vStock} in stock`}">${size}</button>
      `;
      }).join('');
      updateVariantAvailabilityUI();
    }

    $('#colorOptions').addEventListener('click', (e) => {
      const idx = e.target.dataset.colorIdx;
      if (idx === undefined) return;
      selectedColor = product.colors[Number(idx)];
      renderColors();
      renderSizes();
    });

    $('#sizeOptions').addEventListener('click', (e) => {
      const size = e.target.dataset.size;
      if (!size) return;
      selectedSize = size;
      renderSizes();
    });

    addToCartBtn.addEventListener('click', () => {
      if (completelySoldOut) return showToast('This product is sold out');
      if (!selectedSize) return showToast('Please select a size first');
      const vStock = getVariantStock(product, selectedColor.name, selectedSize);
      if (vStock <= 0) return showToast('This color & size is sold out');

      window.addToBag({
        productId: prodId,
        color: selectedColor.name,
        size: selectedSize,
        name: `${product.name} (${selectedColor.name}, ${selectedSize})`,
        price: Number(product.price)
      });
    });

    renderColors();
    renderSizes();
  }

  // ---------- Admin Dashboard Logic (admin.html) ----------
  if ($('#adminProductForm')) {
    const colorRowsContainer = $('#colorRowsContainer');
    const variantStockContainer = $('#variantStockContainer');

    function getCurrentFormColors() {
      return Array.from(colorRowsContainer.querySelectorAll('.color-row'))
        .map((row) => row.querySelector('.c-name').value.trim())
        .filter(Boolean);
    }

    function getCurrentFormSizes() {
      return $('#prodSizesInput').value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    function readCurrentMatrixValues() {
      const map = {};
      if (!variantStockContainer) return map;
      variantStockContainer.querySelectorAll('input[data-variant-key]').forEach((inp) => {
        map[inp.dataset.variantKey] = Math.max(0, parseInt(inp.value, 10) || 0);
      });
      return map;
    }

    function renderVariantStockMatrix(existingStockMap = null) {
      if (!variantStockContainer) return;
      const currentMap = existingStockMap || readCurrentMatrixValues();
      const colors = getCurrentFormColors();
      const sizes = getCurrentFormSizes();

      if (!colors.length || !sizes.length) {
        variantStockContainer.innerHTML = '<p style="font-size:13px; color:var(--grey-600);">Enter at least one color and one size to configure stock.</p>';
        return;
      }

      variantStockContainer.innerHTML = colors.map((color) => `
        <div class="variant-color-block">
          <div class="variant-color-title">${color}</div>
          <div class="variant-size-inputs">
            ${sizes.map((size) => {
              const key = variantKey(color, size);
              const val = key in currentMap ? currentMap[key] : 5;
              return `
                <label class="variant-cell">
                  <span>${size}</span>
                  <input type="number" min="0" step="1" data-variant-key="${key}" value="${val}">
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `).join('');
    }

    function addColorRow(name = '', hex = '#0a0a0a', img = 'images/hero-shoe.jpg') {
      const row = document.createElement('div');
      row.className = 'color-row';
      row.innerHTML = `
        <input type="text" class="c-name" placeholder="Color name" value="${name}" required>
        <input type="color" class="c-hex" value="${hex}" title="Pick swatch color">
        <input type="text" class="c-img" placeholder="images/file.jpg" value="${img}" required>
        <button type="button" class="btn-small btn-danger remove-color-btn">&times;</button>
      `;
      colorRowsContainer.appendChild(row);
    }

    $('#addColorRowBtn').addEventListener('click', () => {
      addColorRow();
      renderVariantStockMatrix();
    });

    colorRowsContainer.addEventListener('input', (e) => {
      if (e.target.classList.contains('c-name')) {
        renderVariantStockMatrix();
      }
    });

    $('#prodSizesInput').addEventListener('input', () => {
      renderVariantStockMatrix();
    });

    if ($('#fillStockBtn')) {
      $('#fillStockBtn').addEventListener('click', () => {
        variantStockContainer.querySelectorAll('input[data-variant-key]').forEach((inp) => {
          inp.value = 5;
        });
      });
    }

    colorRowsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-color-btn')) {
        if (colorRowsContainer.children.length > 1) {
          e.target.closest('.color-row').remove();
          renderVariantStockMatrix();
        } else {
          showToast('At least one color is required');
        }
      }
    });

    function resetAdminForm() {
      $('#adminProductForm').reset();
      $('#editOriginalId').value = '';
      $('#adminFormTitle').textContent = 'Add New Product';
      $('#saveProdBtn').textContent = 'Save Product';
      $('#cancelEditBtn').hidden = true;
      colorRowsContainer.innerHTML = '';
      addColorRow('Default Black', '#0a0a0a', 'images/hero-shoe.jpg');
      renderVariantStockMatrix({});
    }

    function renderAdminList() {
      const products = getProducts();
      const entries = Object.entries(products);
      $('#prodCount').textContent = entries.length;

      if (!entries.length) {
        $('#adminProductList').innerHTML = '<p class="empty">No products found. Add one using the form.</p>';
        return;
      }

      $('#adminProductList').innerHTML = entries.map(([id, p]) => {
        const totalStock = getTotalProductStock(p);
        const totalVariants = (p.colors?.length || 0) * (p.sizes?.length || 0);
        let soldOutVariants = 0;
        (p.colors || []).forEach((c) => {
          (p.sizes || []).forEach((s) => {
            if (getVariantStock(p, c.name, s) <= 0) soldOutVariants++;
          });
        });

        const stockBadge = totalStock === 0
          ? `<span class="admin-stock-tag is-soldout">Sold Out (0)</span>`
          : `<span class="admin-stock-tag">Total Stock: ${totalStock}${soldOutVariants > 0 ? ` (${soldOutVariants}/${totalVariants} sold out)` : ''}</span>`;

        return `
        <div class="admin-item">
          <div class="admin-item__left">
            <img src="${p.colors[0]?.img || ''}" alt="${p.name}" class="admin-item__img">
            <div class="admin-item__meta">
              <h4>${p.name} ${stockBadge}</h4>
              <p>${p.brand} &bull; ${p.category || 'Uncategorized'} (${p.sub || '-'}) &bull; ${formatEGP(p.price)}</p>
              <p>ID: <code>${id}</code> &bull; ${p.colors.length} color(s) &bull; ${p.sizes.length} size(s)</p>
            </div>
          </div>
          <div class="admin-item__actions">
            <a href="product.html?id=${id}" class="btn-small" target="_blank">View</a>
            <button type="button" class="btn-small" data-edit="${id}">Edit</button>
            <button type="button" class="btn-small btn-danger" data-delete="${id}">Delete</button>
          </div>
        </div>
      `;
      }).join('');
    }

    $('#adminProductForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const products = getProducts();
      const originalId = $('#editOriginalId').value;
      const newId = $('#prodIdInput').value.trim().toLowerCase().replace(/\s+/g, '-');

      const colors = Array.from(colorRowsContainer.querySelectorAll('.color-row')).map((row) => ({
        name: row.querySelector('.c-name').value.trim(),
        hex: row.querySelector('.c-hex').value,
        img: row.querySelector('.c-img').value.trim()
      }));

      const sizes = getCurrentFormSizes();
      const rawMatrix = readCurrentMatrixValues();
      const variantStock = {};
      colors.forEach((c) => {
        sizes.forEach((s) => {
          const key = variantKey(c.name, s);
          variantStock[key] = key in rawMatrix ? rawMatrix[key] : 0;
        });
      });

      if (originalId && originalId !== newId) {
        delete products[originalId];
      }

      products[newId] = {
        category: $('#prodCategoryInput') ? $('#prodCategoryInput').value : 'Men',
        sub: $('#prodSubInput') ? $('#prodSubInput').value.trim() : 'Shoes',
        brand: $('#prodBrandInput').value.trim(),
        name: $('#prodNameInput').value.trim(),
        price: parseFloat($('#prodPriceInput').value),
        desc: $('#prodDescInput').value.trim(),
        sizes: sizes,
        colors: colors,
        variantStock: variantStock
      };

      saveProducts(products);
      renderAdminList();
      resetAdminForm();
      showToast(originalId ? 'Product updated!' : 'Product added!');
    });

    $('#adminProductList').addEventListener('click', (e) => {
      const editId = e.target.dataset.edit;
      const deleteId = e.target.dataset.delete;

      if (editId) {
        const products = getProducts();
        const p = products[editId];
        if (!p) return;

        $('#editOriginalId').value = editId;
        $('#prodIdInput').value = editId;
        if ($('#prodCategoryInput')) $('#prodCategoryInput').value = p.category || 'Men';
        if ($('#prodSubInput')) $('#prodSubInput').value = p.sub || '';
        $('#prodBrandInput').value = p.brand;
        $('#prodNameInput').value = p.name;
        $('#prodPriceInput').value = p.price;
        $('#prodDescInput').value = p.desc;
        $('#prodSizesInput').value = p.sizes.join(', ');

        colorRowsContainer.innerHTML = '';
        p.colors.forEach((c) => addColorRow(c.name, c.hex, c.img));
        renderVariantStockMatrix(p.variantStock || {});

        $('#adminFormTitle').textContent = 'Edit Product';
        $('#saveProdBtn').textContent = 'Update Product';
        $('#cancelEditBtn').hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (deleteId) {
        if (!confirm(`Delete "${deleteId}"?`)) return;
        const products = getProducts();
        delete products[deleteId];
        saveProducts(products);
        renderAdminList();
        showToast('Product deleted');
      }
    });

    $('#cancelEditBtn').addEventListener('click', resetAdminForm);

    $('#resetCatalogBtn').addEventListener('click', () => {
      if (!confirm('Reset catalog back to the default sample products?')) return;
      localStorage.removeItem('kynetixProducts');
      renderAdminList();
      resetAdminForm();
      showToast('Catalog reset to defaults');
    });

    resetAdminForm();
    renderAdminList();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeBag(); closeAuth(); }
  });
})();