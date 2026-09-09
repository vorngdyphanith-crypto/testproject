// ==========================================================================
// URBANWEAR CART & CHECKOUT LOGIC (js/cart.js)
// ==========================================================================

let currentCartTotal = 0;

function displayCart() {
  const cartList = document.getElementById("cartList");
  const summaryContainer = document.getElementById("cartSummary");
  const totalElement = document.getElementById("total");
  const subtotalElement = document.getElementById("subtotal");

  if (!cartList) return;

  const cart = Store.getCart();
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = `
            <div style="text-align:center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06);">
                <div style="font-size: 48px; margin-bottom: 15px;">🛒</div>
                <h2 style="font-size: 24px; margin-bottom: 10px;">Your cart is empty</h2>
                <p style="color: #666; margin-bottom: 25px;">Looks like you haven't added any items to your bag yet.</p>
                <a href="shop.html" class="btn" style="background: #111; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; display: inline-block;">
                    Explore Products
                </a>
            </div>
        `;
    if (summaryContainer) {
      summaryContainer.style.display = "none";
    }
    return;
  }

  if (summaryContainer) {
    summaryContainer.style.display = "block";
  }

  let subtotal = 0;

  cart.forEach((item) => {
    const product = Store.getProductById(item.id);
    const maxStock = product ? product.stock : 99;
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const isMaxStock = item.qty >= maxStock;

    cartList.innerHTML += `
            <div class="cart-item" style="display:flex; gap:20px; align-items:center; background:white; padding:20px; border-radius:10px; margin-bottom:15px; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                <img src="${item.image}" alt="${item.name}" style="width:100px; height:100px; object-fit:cover; border-radius:8px;" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'">

                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div>
                            <span style="font-size:12px; color:#888; text-transform:uppercase; font-weight:600;">${item.category || "Apparel"}</span>
                            <h3 style="font-size:18px; margin:4px 0 8px; color:#111;">${item.name}</h3>
                            <div style="color:#666; font-size:14px;">Unit Price: <strong>$${Number(item.price).toFixed(2)}</strong></div>
                        </div>
                        <div style="font-size:18px; font-weight:700; color:#111;">
                            $${itemTotal.toFixed(2)}
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="font-size:13px; color:#555;">Qty:</span>
                            <div style="display:flex; align-items:center; border:1px solid #ddd; border-radius:6px; overflow:hidden;">
                                <button onclick="decreaseQty(${item.id})" style="padding:4px 10px; background:#f5f5f5; border:none; cursor:pointer; font-weight:bold;">-</button>
                                <span style="padding:4px 12px; font-size:14px; font-weight:bold;">${item.qty}</span>
                                <button onclick="increaseQty(${item.id})" style="padding:4px 10px; background:#f5f5f5; border:none; cursor:pointer; font-weight:bold; ${isMaxStock ? "opacity:0.5; cursor:not-allowed;" : ""}">+</button>
                            </div>
                            ${isMaxStock ? `<span style="font-size:11px; color:#c77b00; margin-left:6px;">Max stock reached</span>` : ""}
                        </div>

                        <button onclick="deleteItem(${item.id})" style="background:none; border:none; color:#ef4444; font-size:13px; cursor:pointer; text-decoration:underline;">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
  });

  const shipping = subtotal > 50 ? 0 : 5.0;
  const total = subtotal + shipping;
  currentCartTotal = total;

  if (subtotalElement) {
    subtotalElement.innerText = "$" + subtotal.toFixed(2);
  }
  const shippingElement = document.getElementById("shipping");
  if (shippingElement) {
    shippingElement.innerText =
      shipping === 0 ? "FREE" : "$" + shipping.toFixed(2);
  }
  if (totalElement) {
    totalElement.innerText = "$" + total.toFixed(2);
  }
}

function increaseQty(id) {
  const cart = Store.getCart();
  const item = cart.find((i) => i.id === Number(id));
  if (!item) return;

  const product = Store.getProductById(id);
  if (product && item.qty >= product.stock) {
    alert(`Sorry, only ${product.stock} units are in stock for this item.`);
    return;
  }

  Store.updateCartQty(id, item.qty + 1);
  displayCart();
}

function decreaseQty(id) {
  const cart = Store.getCart();
  const item = cart.find((i) => i.id === Number(id));
  if (!item) return;

  Store.updateCartQty(id, item.qty - 1);
  displayCart();
}

function deleteItem(id) {
  Store.removeFromCart(id);
  displayCart();
}

function handleClearCart() {
  const cart = Store.getCart();
  if (cart.length === 0) {
    alert("Cart is already empty.");
    return;
  }
  if (confirm("Are you sure you want to remove all items from your cart?")) {
    Store.clearCart();
    displayCart();
  }
}

// Interactive Checkout Modal Handlers
function openCheckoutModal() {
  const cart = Store.getCart();
  if (cart.length === 0) {
    alert("Your cart is empty! Please add products from the shop.");
    return;
  }

  const currentUser = Store.getCurrentUser();
  const nameInput = document.getElementById("orderName");
  const emailInput = document.getElementById("orderEmail");
  const modalTotal = document.getElementById("checkoutModalTotal");

  if (currentUser) {
    if (nameInput) {
      nameInput.value =
        `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() ||
        currentUser.email.split("@")[0];
    }
    if (emailInput) {
      emailInput.value = currentUser.email || "";
    }
  } else {
    if (nameInput && !nameInput.value) nameInput.value = "";
    if (emailInput && !emailInput.value) emailInput.value = "";
  }

  if (modalTotal) {
    modalTotal.textContent = "$" + currentCartTotal.toFixed(2);
  }

  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.add("active");
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.classList.remove("active");
}

function handleCheckoutSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("orderName").value.trim();
  const email = document.getElementById("orderEmail").value.trim();
  const address = document.getElementById("orderAddress").value.trim();

  if (!name || !email) {
    alert("Please provide both your name and email address.");
    return;
  }

  const result = Store.checkout({ name, email, address });

  closeCheckoutModal();

  if (!result.success) {
    alert(result.message);
    displayCart();
    return;
  }

  // Render receipt screen
  const mainContainer = document.querySelector("main.container, main.section");
  if (mainContainer) {
    mainContainer.innerHTML = `
      <div style="max-width:680px; margin:40px auto; background:white; padding:45px; border-radius:14px; box-shadow:0 4px 25px rgba(0,0,0,0.08); text-align:center;">
        <div style="width:72px; height:72px; background:#fef3c7; color:#d97706; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:36px; margin:0 auto 20px; border:2px solid #f59e0b;">
          ⏳
        </div>
        <h1 style="font-size:28px; margin-bottom:10px; color:#111;">Order Placed Successfully!</h1>
        <p style="color:#666; font-size:15px; margin-bottom:20px;">
          Thank you, <strong>${result.order.customer}</strong>! Your order has been submitted and is currently <strong>awaiting administrator confirmation</strong>.
        </p>

        <!-- Status Banner -->
        <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:12px 18px; margin-bottom:25px; display:flex; align-items:center; justify-content:space-between; font-size:14px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">🟡</span>
            <span style="color:#92400e; font-weight:600;">Status: Pending Admin Confirmation</span>
          </div>
          <span style="font-size:12px; color:#b45309;">Review in progress</span>
        </div>

        <div style="background:#f8f9fa; border:1px dashed #cbd5e1; border-radius:8px; padding:20px; text-align:left; margin-bottom:25px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
            <span style="color:#777;">Order ID:</span>
            <strong>${result.order.id}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
            <span style="color:#777;">Date & Time:</span>
            <span>${result.order.date} ${result.order.time || ""}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:14px;">
            <span style="color:#777;">Total Amount:</span>
            <strong style="color:#111; font-size:16px;">$${result.order.total.toFixed(2)}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:14px;">
            <span style="color:#777;">Confirmation Email:</span>
            <span>${result.order.email}</span>
          </div>
        </div>

        <div style="display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
          <a href="orders.html" class="btn" style="background:#d4af37; color:#0f172a; padding:12px 26px; border-radius:6px; text-decoration:none; font-weight:700;">
            Track Order / My Orders →
          </a>
          <a href="shop.html" class="btn" style="background:#111; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
            Continue Shopping
          </a>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Store.renderNavbar("cart");
  displayCart();
});
