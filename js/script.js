// ==========================================================================
// URBANWEAR SHOP LOGIC (js/script.js)
// ==========================================================================

let activeCategory = "All";
let searchQuery = "";

// Map category key to display title
const categoryTitleMap = {
  All: "Shop All",
  Men: "Men's Collection",
  Women: "Women's Collection",
  Shoes: "Footwear & Shoes",
  Accessories: "Accessories & Essentials",
};

function getFilteredAndSortedProducts() {
  let list = Store.getProducts();

  // 1. Filter by Search Query
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter((p) => {
      const nameMatch = p.name && p.name.toLowerCase().includes(q);
      const catMatch = p.category && p.category.toLowerCase().includes(q);
      const descMatch =
        p.description && p.description.toLowerCase().includes(q);
      return nameMatch || catMatch || descMatch;
    });
  }

  // 2. Filter by Category
  if (activeCategory !== "All") {
    list = list.filter(
      (p) =>
        p.category && p.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }

  // 3. Sort
  const sortSelect = document.getElementById("sort");
  const sortValue = sortSelect ? sortSelect.value : "default";

  if (sortValue === "low") {
    list.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortValue === "high") {
    list.sort((a, b) => Number(b.price) - Number(a.price));
  } else if (sortValue === "name-asc") {
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortValue === "name-desc") {
    list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  }

  return list;
}

function updateCategoryBadges() {
  const allProducts = Store.getProducts();

  const countAll = allProducts.length;
  const countMen = allProducts.filter(
    (p) => p.category && p.category.toLowerCase() === "men",
  ).length;
  const countWomen = allProducts.filter(
    (p) => p.category && p.category.toLowerCase() === "women",
  ).length;
  const countShoes = allProducts.filter(
    (p) => p.category && p.category.toLowerCase() === "shoes",
  ).length;
  const countAccessories = allProducts.filter(
    (p) => p.category && p.category.toLowerCase() === "accessories",
  ).length;

  const elAll = document.getElementById("count-all");
  const elMen = document.getElementById("count-men");
  const elWomen = document.getElementById("count-women");
  const elShoes = document.getElementById("count-shoes");
  const elAccessories = document.getElementById("count-accessories");

  if (elAll) elAll.textContent = countAll;
  if (elMen) elMen.textContent = countMen;
  if (elWomen) elWomen.textContent = countWomen;
  if (elShoes) elShoes.textContent = countShoes;
  if (elAccessories) elAccessories.textContent = countAccessories;
}

function updateToolbarMeta(filteredCount, totalCount) {
  // Update counter text
  const countEl = document.getElementById("productsCount");
  if (countEl) {
    if (activeCategory !== "All" || searchQuery.trim() !== "") {
      countEl.innerHTML = `Showing <strong>${filteredCount}</strong> of <strong>${totalCount}</strong> items`;
    } else {
      countEl.innerHTML = `Showing <strong>${filteredCount}</strong> items`;
    }
  }

  // Update Section Heading
  const headingEl = document.getElementById("shopHeading");
  if (headingEl) {
    if (searchQuery.trim() !== "") {
      headingEl.textContent = `Search: "${searchQuery}"`;
    } else {
      headingEl.textContent = categoryTitleMap[activeCategory] || "Shop All";
    }
  }

  // Update active chips tag
  const activeChipsWrap = document.getElementById("activeChips");
  const activeChipText = document.getElementById("activeChipText");

  if (activeChipsWrap && activeChipText) {
    if (activeCategory !== "All" || searchQuery.trim() !== "") {
      activeChipsWrap.style.display = "flex";
      let tags = [];
      if (activeCategory !== "All") tags.push(activeCategory);
      if (searchQuery.trim() !== "") tags.push(`"${searchQuery}"`);
      activeChipText.textContent = tags.join(" + ");
    } else {
      activeChipsWrap.style.display = "none";
    }
  }
}

function displayProducts(productList) {
  const shopProducts = document.getElementById("shopProducts");
  if (!shopProducts) return;

  const allProducts = Store.getProducts();
  updateToolbarMeta(productList ? productList.length : 0, allProducts.length);

  shopProducts.innerHTML = "";

  if (!productList || productList.length === 0) {
    shopProducts.innerHTML = `
      <div class="no-products" style="grid-column: 1 / -1; text-align:center; padding: 60px 20px; background:white; border-radius:16px; border:1px solid #e2e8f0;">
        <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
        <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">No products found</h2>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">
          ${searchQuery ? `No results match "${searchQuery}".` : "No products available in this category."}
        </p>
        <button type="button" onclick="resetAllFilters()" style="background:#0f172a; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
          Clear Filters & View All
        </button>
      </div>
    `;
    return;
  }

  productList.forEach((product) => {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    let stockBadge = `<span class="badge badge-stock in-stock" style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:#e3f8ed; color:#16834d; font-weight:600;">In Stock (${product.stock})</span>`;
    if (isOutOfStock) {
      stockBadge = `<span class="badge badge-stock out-of-stock" style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:#fee2e2; color:#dc2626; font-weight:600;">Out of Stock</span>`;
    } else if (isLowStock) {
      stockBadge = `<span class="badge badge-stock low-stock" style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:#fff0d9; color:#c77b00; font-weight:600;">Only ${product.stock} Left</span>`;
    }

    const buttonHtml = isOutOfStock
      ? `<button class="add-cart disabled" disabled style="background:#94a3b8; cursor:not-allowed;">Out of Stock</button>`
      : `<button class="add-cart" onclick="handleAddToCart(event, ${product.id})">Add to Cart</button>`;

    shopProducts.innerHTML += `
      <div class="product-card" onclick="viewProduct(${product.id})" style="cursor: pointer;">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'">
        </div>

        <div class="product-info">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <p class="product-category" style="margin-bottom:0;">${product.category || "General"}</p>
            ${stockBadge}
          </div>

          <h3>${product.name}</h3>

          <div class="product-bottom">
            <div class="product-price">$${Number(product.price).toFixed(2)}</div>
            ${buttonHtml}
          </div>
        </div>
      </div>
    `;
  });
}

function viewProduct(id) {
  localStorage.setItem("selectedProduct", id);
  window.location.href = `product.html?id=${id}`;
}

function handleAddToCart(event, productId) {
  if (event) {
    event.stopPropagation(); // prevent triggering viewProduct
  }
  const result = Store.addToCart(productId, 1);
  if (result.success) {
    showToast(result.message);
  } else {
    alert(result.message);
  }
}

function showToast(message) {
  let toast = document.getElementById("toastNotification");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotification";
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #0f172a;
      color: #fff;
      padding: 14px 24px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      transition: all 0.3s ease;
      border-left: 4px solid #d4af37;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:#d4af37; font-weight:bold;">✓</span> <span>${message}</span>`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 2500);
}

function resetAllFilters() {
  activeCategory = "All";
  searchQuery = "";

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  const clearSearchBtn = document.getElementById("clearSearchBtn");
  if (clearSearchBtn) clearSearchBtn.style.display = "none";

  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((btn) => {
    if (btn.dataset.cat === "All") {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const sortSelect = document.getElementById("sort");
  if (sortSelect) sortSelect.value = "default";

  displayProducts(getFilteredAndSortedProducts());
}

// Setup Filters, Search & Sort
function setupShopControls() {
  // Category buttons
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      activeCategory = this.dataset.cat || "All";
      displayProducts(getFilteredAndSortedProducts());
    });
  });

  // Sort dropdown
  const sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      displayProducts(getFilteredAndSortedProducts());
    });
  }

  // Search input with instant filter
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchQuery = this.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display =
          searchQuery.length > 0 ? "flex" : "none";
      }
      displayProducts(getFilteredAndSortedProducts());
    });
  }

  // Clear search button
  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener("click", function () {
      searchInput.value = "";
      searchQuery = "";
      clearSearchBtn.style.display = "none";
      searchInput.focus();
      displayProducts(getFilteredAndSortedProducts());
    });
  }

  // Clear active chip
  const clearFilterChip = document.getElementById("clearFilterChip");
  if (clearFilterChip) {
    clearFilterChip.addEventListener("click", resetAllFilters);
  }

  // Check URL parameters (e.g. ?category=Men or ?search=hoodie)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  const searchParam = urlParams.get("search");

  if (catParam) {
    const matchedBtn = Array.from(filterButtons).find(
      (btn) => btn.dataset.cat.toLowerCase() === catParam.toLowerCase(),
    );
    if (matchedBtn) {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      matchedBtn.classList.add("active");
      activeCategory = matchedBtn.dataset.cat;
    }
  }

  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    searchQuery = searchParam;
    if (clearSearchBtn) clearSearchBtn.style.display = "flex";
  }
}

// Initial Run
document.addEventListener("DOMContentLoaded", () => {
  Store.renderNavbar("shop");
  updateCategoryBadges();
  setupShopControls();
  displayProducts(getFilteredAndSortedProducts());
});
