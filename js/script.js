// ========================================
// URBANWEAR PRODUCTS
// ========================================

const products = [

    {
        id: 1,
        name: "Urban Black T-Shirt",
        category: "Men",
        price: 15,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ30rvbY4668GAlggsAvzAXcCGDFq0JZHcph2VMZDdFGQ&s=10"
    },

    {
        id: 2,
        name: "Oversized White T-Shirt",
        category: "Men",
        price: 18,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaDg1S91G6Z25ebmJmPmMyYiMUTbsOLhYSqlNkLsA4Sg&s=10"
    },

    {
        id: 3,
        name: "Women's Casual Shirt",
        category: "Women",
        price: 22,
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 4,
        name: "Women's Fashion Jacket",
        category: "Women",
        price: 45,
        image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 5,
        name: "Urban Sneakers",
        category: "Shoes",
        price: 55,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 6,
        name: "Classic White Shoes",
        category: "Shoes",
        price: 60,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 7,
        name: "Urban Cap",
        category: "Accessories",
        price: 12,
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 8,
        name: "Black Backpack",
        category: "Accessories",
        price: 30,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 9,
        name: "Denim Jacket",
        category: "Men",
        price: 40,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80"
    },

    {
        id: 10,
        name: "Women's Hoodie",
        category: "Women",
        price: 35,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
    }
    
];


// ========================================
// GET CART
// ========================================

let cart = JSON.parse(
    localStorage.getItem("cart") || "[]"
);


// ========================================
// SHOW PRODUCTS
// ========================================

function displayProducts(productList) {

    const shopProducts =
        document.getElementById("shopProducts");

    if (!shopProducts) {
        return;
    }

    shopProducts.innerHTML = "";


    if (productList.length === 0) {

        shopProducts.innerHTML = `
            <div class="no-products">
                <h2>No products found</h2>
                <p>Try another category.</p>
            </div>
        `;

        return;
    }


    productList.forEach(product => {

        shopProducts.innerHTML += `

            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="product-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="product-bottom">

                        <strong>
                            $${product.price.toFixed(2)}
                        </strong>

                        <button
                            class="add-cart"
                            onclick="addToCart(${product.id})">

                            Add to Cart

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


// ========================================
// ADD TO CART
// ========================================

function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);


    if (!product) {
        return;
    }


    const existing =
        cart.find(item => item.id === productId);


    if (existing) {

        existing.qty++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            category: product.category,

            price: product.price,

            image: product.image,

            qty: 1

        });

    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        product.name +
        " added to cart!"
    );

}


// ========================================
// CART COUNT
// ========================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cartCount");


    if (!cartCount) {
        return;
    }


    const totalQty =
        cart.reduce(
            (total, item) =>
                total + item.qty,
            0
        );


    cartCount.textContent =
        totalQty;

}


// ========================================
// FILTER
// ========================================

const filterButtons =
    document.querySelectorAll(".filter");


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            this.classList.add("active");


            const category =
                this.dataset.cat;


            if (category === "All") {

                displayProducts(products);

            } else {

                const filtered =
                    products.filter(
                        product =>
                            product.category === category
                    );

                displayProducts(filtered);

            }

        }
    );

});


// ========================================
// SORT
// ========================================

const sortSelect =
    document.getElementById("sort");


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        function () {

            const activeButton =
                document.querySelector(
                    ".filter.active"
                );


            const category =
                activeButton
                    ? activeButton.dataset.cat
                    : "All";


            let result;


            if (category === "All") {

                result = [...products];

            } else {

                result =
                    products.filter(
                        product =>
                            product.category === category
                    );

            }


            if (this.value === "low") {

                result.sort(
                    (a, b) =>
                        a.price - b.price
                );

            }


            if (this.value === "high") {

                result.sort(
                    (a, b) =>
                        b.price - a.price
                );

            }


            displayProducts(result);

        }
    );

}


// ========================================
// LOGIN / STAFF
// ========================================

function checkLogin() {

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            ) || "null"
        );


    const loginLink =
        document.getElementById(
            "loginLink"
        );


    const staffLink =
        document.getElementById(
            "staffLink"
        );


    const logoutLink =
        document.getElementById(
            "logoutLink"
        );


    if (currentUser) {

        if (loginLink) {

            loginLink.textContent =
                currentUser.first_name ||
                currentUser.email;

            loginLink.href =
                "#";

        }


        if (logoutLink) {

            logoutLink.classList.remove(
                "hidden"
            );

        }


        if (
            currentUser.role === "admin" ||
            currentUser.role === "staff"
        ) {

            if (staffLink) {

                staffLink.classList.remove(
                    "hidden"
                );

            }

        }

    }

}


// ========================================
// LOGOUT
// ========================================

const logoutLink =
    document.getElementById(
        "logoutLink"
    );


if (logoutLink) {

    logoutLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "currentUser"
            );


            alert(
                "Logout successful!"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ========================================
// START
// ========================================

displayProducts(products);

updateCartCount();

checkLogin();