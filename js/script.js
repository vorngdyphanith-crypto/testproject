// ==========================================================================
// URBANWEAR SHOP LOGIC (js/script.js)
// ==========================================================================

let activeCategory = "All";

function getFilteredAndSortedProducts() {
  let list = Store.getProducts();

  // Filter by Category
  if (activeCategory !== "All") {
    list = list.filter(
      (p) =>
        p.category && p.category.toLowerCase() === activeCategory.toLowerCase(),
    );
  }

  // Sort
  const sortSelect = document.getElementById("sort");
  const sortValue = sortSelect ? sortSelect.value : "default";

  if (sortValue === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

function displayProducts(productList) {
  const shopProducts = document.getElementById("shopProducts");
  if (!shopProducts) return;

  shopProducts.innerHTML = "";

  if (!productList || productList.length === 0) {
    shopProducts.innerHTML = `
            <div class="no-products" style="grid-column: 1 / -1; text-align:center; padding: 50px 20px;">
                <h2 style="font-size: 24px; margin-bottom: 10px;">No products found</h2>
                <p style="color: #666;">Try selecting another category or check back later.</p>
            </div>
        `;
    return;
  }

  productList.forEach((product) => {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    let stockBadge = `<span class="badge badge-stock in-stock" style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:#e3f8ed; color:#16834d; margin-bottom:8px;">In Stock (${product.stock})</span>`;
    if (isOutOfStock) {
      stockBadge = `<span class="badge badge-stock out-of-stock" style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:#fee2e2; color:#dc2626; margin-bottom:8px;">Out of Stock</span>`;
    } else if (isLowStock) {
      stockBadge = `<span class="badge badge-stock low-stock" style="display:inline-block; font-size:11px; padding:3px 8px; border-radius:12px; background:#fff0d9; color:#c77b00; margin-bottom:8px;">Only ${product.stock} Left</span>`;
    }

    const buttonHtml = isOutOfStock
      ? `<button class="add-cart disabled" disabled style="background:#ccc; cursor:not-allowed;">Out of Stock</button>`
      : `<button class="add-cart" onclick="handleAddToCart(event, ${product.id})">Add to Cart</button>`;

    shopProducts.innerHTML += `
            <div class="product-card" onclick="viewProduct(${product.id})" style="cursor: pointer;">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'">
                </div>

                <div class="product-info">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <p class="product-category">${product.category || "General"}</p>
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
            background: #111;
            color: #fff;
            padding: 14px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            font-size: 14px;
            z-index: 9999;
            transition: all 0.3s ease;
            border-left: 4px solid #d4af37;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 2500);
}

// Setup Filters & Sort
function setupShopControls() {
  const filterButtons = document.querySelectorAll(".filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      activeCategory = this.dataset.cat;
      displayProducts(getFilteredAndSortedProducts());
    });
  });

  const sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      displayProducts(getFilteredAndSortedProducts());
    });
  }
}

// Initial Run
document.addEventListener("DOMContentLoaded", () => {
  Store.renderNavbar("shop");
  setupShopControls();
  displayProducts(getFilteredAndSortedProducts());
});
