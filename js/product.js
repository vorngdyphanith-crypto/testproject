let products = JSON.parse(
    localStorage.getItem("products") || "[]"
);

// Default products
if (products.length === 0) {

    products = [
        {
            id: 1,
            name: "Black T-Shirt",
            price: 15,
            stock: 20,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
        },
        {
            id: 2,
            name: "White T-Shirt",
            price: 18,
            stock: 15,
            image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1"
        },
        {
            id: 3,
            name: "Denim Jacket",
            price: 45,
            stock: 10,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5"
        }
    ];

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );
}

function displayProducts() {

    const productList =
        document.getElementById("productList");

    if (!productList) return;

    productList.innerHTML = "";

    products.forEach(product => {

        productList.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>$${product.price}</p>

                <p>Stock: ${product.stock}</p>

                <button onclick="viewProduct(${product.id})">
                    View Product
                </button>

                <button onclick="addToCart(${product.id})">
                    Add To Cart
                </button>

            </div>
        `;
    });
}

function viewProduct(id) {

    localStorage.setItem(
        "selectedProduct",
        id
    );

    window.location.href = "product.html";
}

function addToCart(id) {

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    const product = products.find(
        p => p.id === id
    );

    if (!product) return;

    if (product.stock <= 0) {
        alert("Product is out of stock!");
        return;
    }

    const existing = cart.find(
        item => item.id === id
    );

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Product added to cart!");
}

displayProducts();