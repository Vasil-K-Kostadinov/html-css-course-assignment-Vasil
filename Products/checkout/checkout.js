let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        displayCheckoutCart();
    }
}

function displayCheckoutCart() {
    const checkoutCartList = document.getElementById("checkout-cart-list");
    checkoutCartList.innerHTML = "";

    cart.forEach(cartItem => {
        const cartItemElement = document.createElement("div");
        cartItemElement.className = "cart-item";
        cartItemElement.innerHTML = `
            <h2>${cartItem.product.title}</h2>
            <p>Price: $${cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price}</p>
            <p>Quantity: ${cartItem.quantity}</p>
        `;
        checkoutCartList.appendChild(cartItemElement);
    });

    calculateTotalPrice();
}

function calculateTotalPrice() {
    let total = 0;
    cart.forEach(cartItem => {
        total += (cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price) * cartItem.quantity;
    });
    document.getElementById("checkout-total-price").textContent = `Total: $${total.toFixed(2)}`;
}

document.getElementById("complete-checkout").addEventListener("click", () => {
    const total = cart.reduce((sum, cartItem) => {
        return sum + (cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price) * cartItem.quantity;
    }, 0);

    const orderDetails = {
        cart: cart,
        total: total
    };

    sessionStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    alert("Thank you for your purchase!");
    localStorage.removeItem("cart");
    window.location.href = "confirmation/index.html";
});

loadCart();
