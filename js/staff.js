// =====================================
// CHECK ADMIN
// =====================================

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


if (
    !currentUser ||
    currentUser.role !== "admin"
) {

    alert(
        "Access denied! Admin only."
    );

    window.location.href =
        "login.html";
}


// =====================================
// GET PRODUCTS
// =====================================

let products = JSON.parse(
    localStorage.getItem("products") || "[]"
);


// =====================================
// DISPLAY PRODUCTS
// =====================================

function displayAdminProducts() {

    const box =
        document.getElementById(
            "adminProducts"
        );

    box.innerHTML = "";

    products.forEach(
        (product, index) => {

            box.innerHTML += `

                <div class="admin-product">

                    <img
                        src="${product.image}"
                    >

                    <div>

                        <h3>
                            ${product.name}
                        </h3>

                        <p>
                            Price: $${product.price}
                        </p>

                        <p>
                            Stock: ${product.stock}
                        </p>

                        <button
                            onclick="deleteProduct(${index})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;
        }
    );
}


// =====================================
// ADD PRODUCT
// =====================================

function addProduct() {

    const name =
        document.getElementById(
            "productName"
        ).value.trim();

    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );

    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );

    const image =
        document.getElementById(
            "productImage"
        ).value.trim();


    if (
        !name ||
        !price ||
        !stock ||
        !image
    ) {

        alert(
            "Please fill all fields!"
        );

        return;
    }


    const newProduct = {

        id: Date.now(),

        name: name,

        price: price,

        stock: stock,

        image: image

    };


    products.push(newProduct);


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    alert(
        "Product added successfully!"
    );


    document.getElementById(
        "productName"
    ).value = "";

    document.getElementById(
        "productPrice"
    ).value = "";

    document.getElementById(
        "productStock"
    ).value = "";

    document.getElementById(
        "productImage"
    ).value = "";


    displayAdminProducts();
}


// =====================================
// DELETE PRODUCT
// =====================================

function deleteProduct(index) {

    const confirmDelete =
        confirm(
            "Delete this product?"
        );

    if (!confirmDelete) return;


    products.splice(index, 1);


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );


    displayAdminProducts();
}


// =====================================
// DISPLAY USERS
// =====================================

function displayUsers() {

    const box =
        document.getElementById(
            "usersList"
        );

    const users =
        JSON.parse(
            localStorage.getItem("users") ||
            "[]"
        );


    box.innerHTML = "";


    users.forEach(user => {

        box.innerHTML += `

            <div class="user-row">

                <strong>
                    ${user.first_name}
                    ${user.last_name}
                </strong>

                <span>
                    ${user.email}
                </span>

                <span>
                    Role: ${user.role}
                </span>

            </div>

        `;
    });
}


// =====================================
// LOGOUT
// =====================================

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";
}


displayAdminProducts();

displayUsers();