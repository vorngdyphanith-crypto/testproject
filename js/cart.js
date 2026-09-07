function displayCart() {

    const cartList =
        document.getElementById("cartList");

    const totalElement =
        document.getElementById("total");

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    cartList.innerHTML = "";

    if (cart.length === 0) {

        cartList.innerHTML =
            "<h3>Your cart is empty.</h3>";

        totalElement.innerText = "Total: $0";

        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.qty;

        total += itemTotal;

        cartList.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}">

                <div>
                    <h3>${item.name}</h3>

                    <p>Price: $${item.price}</p>

                    <p>Quantity: ${item.qty}</p>

                    <p>
                        Total: $${itemTotal}
                    </p>

                    <button onclick="increase(${index})">
                        +
                    </button>

                    <button onclick="decrease(${index})">
                        -
                    </button>

                    <button onclick="removeItem(${index})">
                        Remove
                    </button>
                </div>

            </div>
        `;
    });

    totalElement.innerText =
        "Total: $" + total.toFixed(2);
}


function increase(index) {

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    cart[index].qty++;

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


function decrease(index) {

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    if (cart[index].qty > 1) {

        cart[index].qty--;

    } else {

        cart.splice(index, 1);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


function removeItem(index) {

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}


function checkout() {

    let cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
    );

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    alert(
        "Order placed successfully!"
    );

    localStorage.removeItem("cart");

    displayCart();
}


displayCart();