// =====================================
// URBANWEAR STAFF OPERATIONS (js/staff.js)
// =====================================

// Authentication Check - Admin Only
const currentUser = Store.getCurrentUser();
if (!currentUser || currentUser.role !== "admin") {
  alert("Access denied! Administrators only.");
  window.location.href = "login.html";
}

// Display Products
function displayAdminProducts() {
  const box = document.getElementById("adminProducts");
  if (!box) return;

  const products = Store.getProducts();
  box.innerHTML = "";

  if (products.length === 0) {
    box.innerHTML = `<p style="color:#666;">No products found in catalog.</p>`;
    return;
  }

  products.forEach((product) => {
    box.innerHTML += `
            <div class="admin-product">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between;">
                        <h3 style="font-size:16px;">${product.name}</h3>
                        <span style="font-size:12px; background:#f1f5f9; padding:2px 8px; border-radius:4px;">${product.category || "General"}</span>
                    </div>
                    <p style="color:#555; font-size:14px; margin:4px 0;">Price: <strong>$${Number(product.price).toFixed(2)}</strong> | Stock: <strong>${product.stock}</strong></p>
                    <div style="margin-top:8px;">
                        <button onclick="editProduct(${product.id})" class="btn" style="background:#f1f5f9; color:#333; border:1px solid #ccc; padding:5px 12px; font-size:12px; border-radius:4px; margin:0 5px 0 0;">
                            Edit
                        </button>
                        <button onclick="deleteProduct(${product.id})" class="btn" style="background:#fee2e2; color:#dc2626; border:none; padding:5px 12px; font-size:12px; border-radius:4px; margin:0;">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
  });
}

// Add Product
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value;
  const price = Number(document.getElementById("productPrice").value);
  const stock = Number(document.getElementById("productStock").value);
  const image = document.getElementById("productImage").value.trim();

  if (!name || isNaN(price) || isNaN(stock) || !image) {
    alert("Please fill in all product fields correctly!");
    return;
  }

  Store.addProduct({
    name,
    category,
    price,
    stock,
    image,
    description: `${name} - UrbanWear collection.`,
  });

  alert("Product added successfully!");

  document.getElementById("productName").value = "";
  document.getElementById("productPrice").value = "";
  document.getElementById("productStock").value = "";
  document.getElementById("productImage").value = "";

  displayAdminProducts();
}

// Delete Product
function deleteProduct(id) {
  const product = Store.getProductById(id);
  if (!product) return;

  if (confirm(`Delete "${product.name}"?`)) {
    Store.deleteProduct(id);
    displayAdminProducts();
  }
}

// Edit Product
function editProduct(id) {
  const product = Store.getProductById(id);
  if (!product) return;

  const name = prompt("Product Name:", product.name);
  if (name === null) return;

  const price = Number(prompt("Price ($):", product.price));
  if (isNaN(price)) return;

  const stock = Number(prompt("Stock Level:", product.stock));
  if (isNaN(stock)) return;

  const image = prompt("Image URL:", product.image);
  if (!image) return;

  Store.updateProduct(id, {
    name: name.trim(),
    price,
    stock,
    image: image.trim(),
  });

  alert("Product updated!");
  displayAdminProducts();
}

// Display Users
function displayUsers() {
  const box = document.getElementById("usersList");
  if (!box) return;

  const users = Store.getUsers();
  box.innerHTML = "";

  users.forEach((user) => {
    const isMasterAdmin =
      user.email && user.email.toLowerCase() === "admin@gmail.com";
    const deleteButton = isMasterAdmin
      ? `<span style="font-size:12px; color:#888;">(Master Admin)</span>`
      : `<button onclick="deleteUser('${user.email}')" class="btn" style="background:#fee2e2; color:#dc2626; border:none; padding:5px 12px; font-size:12px; border-radius:4px; margin:0;">Delete</button>`;

    box.innerHTML += `
            <div class="user-row">
                <div>
                    <strong>${user.first_name || ""} ${user.last_name || ""}</strong>
                    <div style="font-size:13px; color:#666;">${user.email}</div>
                </div>
                <div style="display:flex; align-items:center; gap:15px;">
                    <span style="font-size:12px; font-weight:bold; text-transform:uppercase; background:#f1f5f9; padding:4px 8px; border-radius:4px;">
                        ${user.role || "user"}
                    </span>
                    ${deleteButton}
                </div>
            </div>
        `;
  });
}

// Delete User
function deleteUser(email) {
  if (confirm(`Delete user "${email}"?`)) {
    const res = Store.deleteUser(email);
    if (res.success) {
      displayUsers();
    } else {
      alert(res.message);
    }
  }
}

// Add User
function addUser() {
  const firstName = document.getElementById("userFirstName").value.trim();
  const lastName = document.getElementById("userLastName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;
  const role = document.getElementById("userRole").value;

  if (!firstName || !lastName || !email || !password) {
    alert("Please fill in all user fields!");
    return;
  }

  const res = Store.addUser({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    role,
    gender: "Not Specified",
  });

  if (!res.success) {
    alert(res.message);
    return;
  }

  document.getElementById("userFirstName").value = "";
  document.getElementById("userLastName").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userPassword").value = "";
  document.getElementById("userRole").value = "user";

  displayUsers();
  alert("User added successfully!");
}

// Logout
function logout() {
  Store.logout();
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  displayAdminProducts();
  displayUsers();
});
