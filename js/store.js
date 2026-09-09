// ==========================================================================
// URBANWEAR CENTRAL DATA STORE & UTILITIES
// ==========================================================================

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Urban Black T-Shirt",
    category: "Men",
    price: 15,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description:
      "Classic black cotton t-shirt with premium finish, comfortable regular fit for everyday urban wear.",
  },
  {
    id: 2,
    name: "Oversized White T-Shirt",
    category: "Men",
    price: 18,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80",
    description:
      "Drop-shoulder relaxed oversized white t-shirt made of heavyweight 100% organic cotton.",
  },
  {
    id: 3,
    name: "Women's Casual Shirt",
    category: "Women",
    price: 22,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    description:
      "Breathable linen-blend casual shirt perfect for work or leisure with subtle button detailing.",
  },
  {
    id: 4,
    name: "Women's Fashion Jacket",
    category: "Women",
    price: 45,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80",
    description:
      "Contemporary tailored fashion jacket offering lightweight insulation and sleek silhouette.",
  },
  {
    id: 5,
    name: "Urban Street Sneakers",
    category: "Shoes",
    price: 55,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    description:
      "Signature red lightweight street runners featuring cushioned foam sole and dynamic grip.",
  },
  {
    id: 6,
    name: "Classic White Shoes",
    category: "Shoes",
    price: 60,
    stock: 14,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    description:
      "Timeless low-top minimal leather sneakers suitable for casual styling and all-day comfort.",
  },
  {
    id: 7,
    name: "Urban Cotton Cap",
    category: "Accessories",
    price: 12,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    description:
      "Adjustable 6-panel cotton baseball cap with embroidered logo and curved visor.",
  },
  {
    id: 8,
    name: "Black Minimalist Backpack",
    category: "Accessories",
    price: 30,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    description:
      "Water-resistant commuter backpack with dedicated 15-inch laptop sleeve and hidden pocket.",
  },
  {
    id: 9,
    name: "Vintage Denim Jacket",
    category: "Men",
    price: 40,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80",
    description:
      "Sturdy washed denim jacket with metal button placket and twin chest flap pockets.",
  },
  {
    id: 10,
    name: "Cozy Women's Hoodie",
    category: "Women",
    price: 35,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    description:
      "Soft brushed fleece pullover hoodie featuring kangaroo front pocket and ribbed cuffs.",
  },
];

const INITIAL_USERS = [
  {
    first_name: "Admin",
    last_name: "User",
    gender: "Male",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  },
];

const INITIAL_ORDERS = [
  {
    id: "ORD-1001",
    date: "2026-09-08",
    customer: "Sarah Jenkins",
    email: "sarah.j@example.com",
    total: 57.0,
    status: "Confirmed",
    items: [
      { id: 3, name: "Women's Casual Shirt", price: 22, qty: 1 },
      { id: 10, name: "Cozy Women's Hoodie", price: 35, qty: 1 },
    ],
  },
  {
    id: "ORD-1002",
    date: "2026-09-08",
    customer: "Michael Wong",
    email: "mwong@example.com",
    total: 73.0,
    status: "Pending",
    items: [
      { id: 5, name: "Urban Street Sneakers", price: 55, qty: 1 },
      { id: 2, name: "Oversized White T-Shirt", price: 18, qty: 1 },
    ],
  },
];

// Helper to identify stale mini-market items (e.g. Lemon Soda, Pepsi, Soap)
function isStaleForeignItem(name) {
  if (!name || typeof name !== "string") return true;
  const lower = name.toLowerCase();
  return (
    lower.includes("lemon") ||
    lower.includes("soda") ||
    lower.includes("pepsi") ||
    lower.includes("soap")
  );
}

// --- INITIALIZATION & AUTO-CLEANSING ---
(function initStore() {
  // 1. Cleanse & Initialize Products
  const existingProducts = localStorage.getItem("products");
  if (!existingProducts) {
    localStorage.setItem("products", JSON.stringify(INITIAL_PRODUCTS));
  } else {
    try {
      let parsed = JSON.parse(existingProducts);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem("products", JSON.stringify(INITIAL_PRODUCTS));
      } else {
        // Filter out stale non-clothing items like Lemon Soda
        parsed = parsed.filter(
          (p) => p && p.name && !isStaleForeignItem(p.name),
        );
        if (parsed.length === 0) {
          parsed = INITIAL_PRODUCTS;
        } else {
          parsed.forEach((p) => {
            if (!p.category) p.category = "Men";
            if (typeof p.stock === "undefined") p.stock = 15;
            if (!p.description)
              p.description = `${p.name} - UrbanWear collection.`;
          });
        }
        localStorage.setItem("products", JSON.stringify(parsed));
      }
    } catch (e) {
      localStorage.setItem("products", JSON.stringify(INITIAL_PRODUCTS));
    }
  }

  // 2. Cleanse Cart (Remove any stale Lemon Soda or invalid items)
  const existingCart = localStorage.getItem("cart");
  if (existingCart) {
    try {
      let cart = JSON.parse(existingCart);
      if (Array.isArray(cart)) {
        const cleanCart = cart.filter(
          (item) => item && item.name && !isStaleForeignItem(item.name),
        );
        localStorage.setItem("cart", JSON.stringify(cleanCart));
      }
    } catch (e) {
      localStorage.removeItem("cart");
    }
  }

  // 3. Cleanse Orders (Remove any old orders containing Lemon Soda)
  const existingOrders = localStorage.getItem("orders");
  if (!existingOrders) {
    localStorage.setItem("orders", JSON.stringify(INITIAL_ORDERS));
  } else {
    try {
      let orders = JSON.parse(existingOrders);
      if (Array.isArray(orders)) {
        const cleanOrders = orders.filter((order) => {
          if (!order || !Array.isArray(order.items)) return false;
          return !order.items.some((i) => i && isStaleForeignItem(i.name));
        });
        localStorage.setItem(
          "orders",
          JSON.stringify(cleanOrders.length > 0 ? cleanOrders : INITIAL_ORDERS),
        );
      }
    } catch (e) {
      localStorage.setItem("orders", JSON.stringify(INITIAL_ORDERS));
    }
  }

  // 4. Initialize Users
  const existingUsers = localStorage.getItem("users");
  if (!existingUsers) {
    localStorage.setItem("users", JSON.stringify(INITIAL_USERS));
  } else {
    try {
      const users = JSON.parse(existingUsers);
      const hasAdmin = users.some(
        (u) => u.email && u.email.toLowerCase() === "admin@gmail.com",
      );
      if (!hasAdmin) {
        users.push(INITIAL_USERS[0]);
        localStorage.setItem("users", JSON.stringify(users));
      }
    } catch (e) {
      localStorage.setItem("users", JSON.stringify(INITIAL_USERS));
    }
  }
})();

// ==========================================================================
// STORE API
// ==========================================================================
window.Store = {
  // --- PRODUCTS ---
  getProducts() {
    try {
      const list = JSON.parse(localStorage.getItem("products")) || [];
      return list.filter((p) => p && !isStaleForeignItem(p.name));
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  },

  getProductById(id) {
    const numId = Number(id);
    return this.getProducts().find((p) => p.id === numId) || null;
  },

  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  },

  addProduct(product) {
    const products = this.getProducts();
    product.id = Date.now();
    product.price = Number(product.price);
    product.stock = Number(product.stock);
    products.push(product);
    this.saveProducts(products);
    return product;
  },

  updateProduct(id, updatedData) {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedData };
      products[index].price = Number(products[index].price);
      products[index].stock = Number(products[index].stock);
      this.saveProducts(products);
      return products[index];
    }
    return null;
  },

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter((p) => p.id !== Number(id));
    this.saveProducts(products);
  },

  // --- CART ---
  getCart() {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const products = this.getProducts();
      // Keep only valid clothing products that exist in current catalog
      const cleanCart = cart.filter((item) => {
        if (!item || isStaleForeignItem(item.name)) return false;
        return products.some((p) => p.id === item.id);
      });
      if (cleanCart.length !== cart.length) {
        localStorage.setItem("cart", JSON.stringify(cleanCart));
      }
      return cleanCart;
    } catch (e) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateNavBadges();
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  },

  addToCart(productId, qtyToAdd = 1) {
    const product = this.getProductById(productId);
    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product.stock <= 0) {
      return {
        success: false,
        message: `"${product.name}" is currently out of stock!`,
      };
    }

    const cart = this.getCart();
    const existing = cart.find((item) => item.id === product.id);
    const currentInCart = existing ? existing.qty : 0;

    if (currentInCart + qtyToAdd > product.stock) {
      return {
        success: false,
        message: `Only ${product.stock} items available in stock. You already have ${currentInCart} in your cart.`,
      };
    }

    if (existing) {
      existing.qty += qtyToAdd;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        qty: qtyToAdd,
      });
    }

    this.saveCart(cart);
    return { success: true, message: `Added "${product.name}" to your cart!` };
  },

  updateCartQty(productId, newQty) {
    const cart = this.getCart();
    const index = cart.findIndex((item) => item.id === Number(productId));
    if (index === -1) return;

    const product = this.getProductById(productId);
    const maxStock = product ? product.stock : 999;

    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = Math.min(newQty, maxStock);
    }
    this.saveCart(cart);
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter((item) => item.id !== Number(productId));
    this.saveCart(cart);
  },

  clearCart() {
    localStorage.removeItem("cart");
    this.updateNavBadges();
  },

  // --- CHECKOUT & ORDERS ---
  getOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      return orders.filter((ord) => {
        if (!ord || !Array.isArray(ord.items)) return false;
        return !ord.items.some((i) => i && isStaleForeignItem(i.name));
      });
    } catch (e) {
      return [];
    }
  },

  saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
  },

  getOrderById(id) {
    return (
      this.getOrders().find(
        (o) => String(o.id).toUpperCase() === String(id).toUpperCase(),
      ) || null
    );
  },

  getOrdersByCustomer(email) {
    if (!email) return [];
    return this.getOrders().filter(
      (o) => o.email && o.email.toLowerCase() === email.toLowerCase(),
    );
  },

  checkout(customerInfo = {}) {
    const cart = this.getCart();
    if (cart.length === 0) {
      return {
        success: false,
        message: "Your cart is empty! Please add items to checkout.",
      };
    }

    const products = this.getProducts();

    // 1. Verify and filter valid items
    const validItems = [];
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.id);
      if (!prod) {
        continue; // Skip any orphaned or non-existent items
      }
      if (prod.stock < item.qty) {
        return {
          success: false,
          message: `Not enough stock for "${item.name}". Only ${prod.stock} available.`,
        };
      }
      validItems.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        category: prod.category,
        qty: item.qty,
      });
    }

    if (validItems.length === 0) {
      this.clearCart();
      return {
        success: false,
        message:
          "The items in your cart are no longer available. Cart has been refreshed.",
      };
    }

    // 2. Deduct stock for verified items
    for (const item of validItems) {
      const prod = products.find((p) => p.id === item.id);
      if (prod) {
        prod.stock -= item.qty;
      }
    }
    this.saveProducts(products);

    // 3. Compute total
    const total = validItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    // 4. Create Order Record in PENDING status
    const currentUser = this.getCurrentUser();
    const order = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      customer:
        customerInfo.name ||
        (currentUser
          ? `${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() ||
            currentUser.email
          : "Guest Customer"),
      email:
        customerInfo.email ||
        (currentUser ? currentUser.email : "guest@urbanwear.com"),
      address: customerInfo.address || "Standard Delivery",
      total: Number(total.toFixed(2)),
      status: "Pending", // Awaiting Admin Confirmation
      items: [...validItems],
    };

    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    // 5. Clear Cart
    this.clearCart();

    return {
      success: true,
      order: order,
      message:
        "Order placed successfully! Waiting for administrator confirmation.",
    };
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(
      (o) => String(o.id).toUpperCase() === String(orderId).toUpperCase(),
    );
    if (!order) return { success: false, message: "Order not found" };

    const oldStatus = order.status;

    // Restock on cancellation
    if (oldStatus !== "Cancelled" && newStatus === "Cancelled") {
      const products = this.getProducts();
      (order.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.id);
        if (prod) {
          prod.stock += item.qty;
        }
      });
      this.saveProducts(products);
    }

    order.status = newStatus;
    if (newStatus === "Confirmed") {
      order.confirmedAt = new Date().toISOString();
    }

    this.saveOrders(orders);
    return {
      success: true,
      order,
      message: `Order ${orderId} status updated to ${newStatus}.`,
    };
  },

  // --- RESET UTILITY ---
  resetToCleanState() {
    localStorage.setItem("products", JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem("orders", JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem("users", JSON.stringify(INITIAL_USERS));
    localStorage.removeItem("cart");
    this.updateNavBadges();
  },

  // --- USERS & AUTH ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem("users")) || [];
    } catch (e) {
      return [];
    }
  },

  saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  },

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("currentUser")) || null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  },

  addUser(user) {
    const users = this.getUsers();
    if (
      users.some(
        (u) => u.email && u.email.toLowerCase() === user.email.toLowerCase(),
      )
    ) {
      return { success: false, message: "Email already registered!" };
    }
    users.push(user);
    this.saveUsers(users);
    return { success: true, message: "User added successfully!" };
  },

  deleteUser(email) {
    let users = this.getUsers();
    const target = users.find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!target) return { success: false, message: "User not found" };
    if (target.email.toLowerCase() === "admin@gmail.com") {
      return {
        success: false,
        message: "Cannot delete master administrator account!",
      };
    }
    users = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    this.saveUsers(users);
    return { success: true, message: "User deleted successfully!" };
  },

  // --- SHARED NAVBAR UTILITY ---
  updateNavBadges() {
    const cartCounts = document.querySelectorAll(
      "#cartCount, .cart-count-badge",
    );
    const count = this.getCartCount();
    cartCounts.forEach((el) => {
      el.textContent = count;
    });
  },

  renderNavbar(activePage = "") {
    const navContainer = document.querySelector("header nav, .header nav");
    if (!navContainer) return;

    const currentUser = this.getCurrentUser();
    const cartCount = this.getCartCount();

    let navHtml = `
            <a href="index.html" class="${activePage === "home" ? "active" : ""}">Home</a>
            <a href="shop.html" class="${activePage === "shop" ? "active" : ""}">Shop</a>
            <a href="orders.html" class="${activePage === "orders" ? "active" : ""}">Orders</a>
            <a href="cart.html" class="${activePage === "cart" ? "active" : ""}">Cart <b id="cartCount">${cartCount}</b></a>
        `;

    if (currentUser) {
      const isAdmin = currentUser.role === "admin";
      if (isAdmin) {
        navHtml += `<a href="dashboard.html" class="${activePage === "dashboard" ? "active" : ""}">Dashboard</a>`;
      }
      navHtml += `
                <span class="nav-user" style="color:#d4af37; font-weight:600; font-size:14px; margin-left:5px;">
                    Hi, ${currentUser.first_name || currentUser.email.split("@")[0]}
                </span>
                <a href="#" id="globalLogoutBtn" style="color:#ef4444;">Logout</a>
            `;
    } else {
      navHtml += `
                <a href="login.html" class="${activePage === "login" ? "active" : ""}">Login</a>
                <a href="register.html" class="${activePage === "register" ? "active" : ""}">Register</a>
            `;
    }

    navContainer.innerHTML = navHtml;

    const logoutBtn = document.getElementById("globalLogoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        Store.logout();
      });
    }
  },
};

// Automatically bind nav on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  Store.updateNavBadges();
});
