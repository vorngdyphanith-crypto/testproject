// ==========================================================================
// URBANWEAR PRODUCT DETAIL LOGIC (js/product.js)
// ==========================================================================

function getRequestedProductId() {
  // 1. Try URL search param ?id=...
  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get("id");
  if (paramId) return Number(paramId);

  // 2. Try localStorage selectedProduct
  const storedId = localStorage.getItem("selectedProduct");
  if (storedId) return Number(storedId);

  return null;
}

function renderProductDetail() {
  const detailContainer = document.getElementById("productDetail");
  if (!detailContainer) return;

  const productId = getRequestedProductId();
  const product = productId ? Store.getProductById(productId) : null;

  if (!product) {
    detailContainer.innerHTML = `
            <div style="text-align:center; padding:60px 20px; background:white; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.06);">
                <h2 style="font-size:26px; margin-bottom:12px;">Product Not Found</h2>
                <p style="color:#666; margin-bottom:24px;">The product you're looking for does not exist or may have been removed.</p>
                <a href="shop.html" class="btn" style="background:#111; color:white; padding:12px 24px; border-radius:6px; text-decoration:none;">Back to Shop</a>
            </div>
        `;
    return;
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  let stockBadge = `<span style="display:inline-block; font-size:12px; font-weight:600; padding:4px 10px; border-radius:20px; background:#e3f8ed; color:#16834d;">In Stock (${product.stock} available)</span>`;
  if (isOutOfStock) {
    stockBadge = `<span style="display:inline-block; font-size:12px; font-weight:600; padding:4px 10px; border-radius:20px; background:#fee2e2; color:#dc2626;">Out of Stock</span>`;
  } else if (isLowStock) {
    stockBadge = `<span style="display:inline-block; font-size:12px; font-weight:600; padding:4px 10px; border-radius:20px; background:#fff0d9; color:#c77b00;">Low Stock (${product.stock} left)</span>`;
  }

  // Set page title
  document.title = `${product.name} | UrbanWear`;

  detailContainer.innerHTML = `
        <div class="breadcrumb" style="margin-bottom:25px; font-size:14px; color:#777;">
            <a href="index.html" style="color:#777; text-decoration:none;">Home</a> /
            <a href="shop.html" style="color:#777; text-decoration:none;">Shop</a> /
            <span style="color:#111; font-weight:600;">${product.name}</span>
        </div>

        <div class="detail-card" style="display:grid; grid-template-columns: 1fr 1fr; gap:50px; background:white; padding:40px; border-radius:12px; box-shadow:0 3px 15px rgba(0,0,0,0.06);">
            <div class="detail-image-box" style="border-radius:10px; overflow:hidden; background:#fafafa;">
                <img src="${product.image}" alt="${product.name}" style="width:100%; max-height:550px; object-fit:cover; display:block;" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'">
            </div>

            <div class="detail-content" style="display:flex; flex-direction:column; justify-content:center;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <span style="text-transform:uppercase; letter-spacing:1.5px; font-size:12px; font-weight:700; color:#888;">${product.category || "Apparel"}</span>
                    ${stockBadge}
                </div>

                <h1 style="font-size:32px; font-weight:700; margin-bottom:15px; color:#111;">${product.name}</h1>

                <div style="font-size:28px; font-weight:700; color:#d4af37; margin-bottom:20px;">
                    $${Number(product.price).toFixed(2)}
                </div>

                <p style="color:#555; line-height:1.7; margin-bottom:30px; font-size:15px;">
                    ${product.description || "Premium quality clothing crafted with modern aesthetics and maximum durability."}
                </p>

                ${
                  !isOutOfStock
                    ? `
                    <div style="display:flex; align-items:center; gap:15px; margin-bottom:25px;">
                        <span style="font-weight:600; font-size:14px;">Quantity:</span>
                        <div style="display:flex; align-items:center; border:1px solid #ddd; border-radius:6px; overflow:hidden;">
                            <button type="button" onclick="changeQty(-1, ${product.stock})" style="padding:8px 14px; background:#f0f0f0; border:none; cursor:pointer; font-size:16px; font-weight:bold;">-</button>
                            <input type="number" id="detailQty" value="1" min="1" max="${product.stock}" readonly style="width:50px; text-align:center; border:none; font-size:15px; font-weight:bold; background:transparent;">
                            <button type="button" onclick="changeQty(1, ${product.stock})" style="padding:8px 14px; background:#f0f0f0; border:none; cursor:pointer; font-size:16px; font-weight:bold;">+</button>
                        </div>
                    </div>

                    <div style="display:flex; gap:15px; flex-wrap:wrap;">
                        <button onclick="handleDetailAddToCart(${product.id})" class="btn" style="flex:1; min-width:200px; background:#111; color:white; padding:14px 28px; border:none; border-radius:8px; font-size:15px; font-weight:600; cursor:pointer; transition:0.3s;">
                            🛒 Add to Cart
                        </button>
                        <a href="cart.html" class="btn" style="background:#d4af37; color:#111; padding:14px 24px; border:none; border-radius:8px; font-size:15px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">
                            View Cart
                        </a>
                    </div>
                `
                    : `
                    <button disabled style="background:#ccc; color:#666; padding:14px 28px; border:none; border-radius:8px; font-size:15px; font-weight:600; cursor:not-allowed;">
                        Out of Stock
                    </button>
                `
                }

                <div style="margin-top:35px; border-top:1px solid #eee; padding-top:20px; display:flex; gap:30px; font-size:13px; color:#777;">
                    <div>✓ Free Shipping Over $50</div>
                    <div>✓ 30-Day Easy Returns</div>
                    <div>✓ 100% Authentic Product</div>
                </div>
            </div>
        </div>
    `;
}

function changeQty(delta, maxStock) {
  const qtyInput = document.getElementById("detailQty");
  if (!qtyInput) return;
  let current = parseInt(qtyInput.value) || 1;
  let next = current + delta;
  if (next < 1) next = 1;
  if (next > maxStock) next = maxStock;
  qtyInput.value = next;
}

function handleDetailAddToCart(productId) {
  const qtyInput = document.getElementById("detailQty");
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

  const result = Store.addToCart(productId, qty);
  if (result.success) {
    alert(result.message);
  } else {
    alert(result.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Store.renderNavbar("shop");
  renderProductDetail();
});
