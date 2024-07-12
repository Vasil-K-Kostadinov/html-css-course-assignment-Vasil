document.addEventListener("DOMContentLoaded", function() {
    const orderDetailsElement = document.getElementById("order-details");
    const totalPriceElement = document.getElementById("total-price");

    // Load order details from session storage
    const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));

    if (orderDetails && orderDetails.cart.length > 0) {
        orderDetails.cart.forEach(cartItem => {
            const cartItemElement = document.createElement("div");
            cartItemElement.className = "cart-item";
            cartItemElement.innerHTML = `
                <img src="${cartItem.product.image}" alt="${cartItem.product.title}">
                <div>
                    <h2>${cartItem.product.title}</h2>
                    <p>Price: $${cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price}</p>
                    <p>Quantity: ${cartItem.quantity}</p>
                </div>
            `;
            orderDetailsElement.appendChild(cartItemElement);
        });

        totalPriceElement.textContent = `Total: $${orderDetails.total.toFixed(2)}`;
    } else {
        orderDetailsElement.innerHTML = "<p>No order details found.</p>";
    }
});
