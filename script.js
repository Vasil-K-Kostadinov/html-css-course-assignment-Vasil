const apiUrl = "https://api.noroff.dev/api/v1/square-eyes";
let products = [];
let cart = [];

async function fetchAllProducts() {
    try {
        const response = await fetch(apiUrl);
        console.log("Response status:", response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        products = await response.json();
        console.log("Fetched Products JSON:", products);
        populateGenreDropdown(products);
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        showToast("Failed to load products. Please try again later.");
    }   
}

function populateGenreDropdown(products) {
    const genreDropdown = document.getElementById("genre-dropdown");
    const genres = new Set(products.map(product => product.genre));
    genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreDropdown.appendChild(option);
    });
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    products.forEach(product => {
        const productItem = document.createElement("div");
        productItem.className = "product-item";
        
        let priceInfo;
        if (product.onSale) {
            priceInfo = `
                <p>
                    <span class="discounted-price">$${product.discountedPrice}</span>
                    <span class="regular-price">$${product.price}</span>
                </p>
            `;
        } else {
            priceInfo = `<p>$${product.price}</p>`;
        }

        productItem.innerHTML = `
            <a href="products/index.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" title="${product.name}">
            </a>
            <h2>${product.title}</h2>
            <p>${priceInfo}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        
        productList.appendChild(productItem);

        productItem.querySelector(".add-to-cart").addEventListener("click", () => {
            addToCart(product.id);
        });
    });
}

function addToCart(productId) {
    console.log("Adding to cart:", productId);
    const product = products.find(product => product.id === productId);
    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    const cartItem = cart.find(item => item.product.id === productId);

    if (cartItem) {
        const confirmAdd = confirm("This product is already in your cart. Are you sure you want another one?");
        if (confirmAdd) {
            cartItem.quantity++;
        } else {
            return; 
        }
    } else {
        cart.push({ product, quantity: 1 });
    }

    console.log("Current cart:", cart);
    displayCart();
    saveCart();
}

function removeFromCart(productId) {
    console.log("Removing from cart:", productId);
    cart = cart.filter(cartItem => cartItem.product.id !== productId);
    displayCart();
    saveCart();
}

function displayCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";

    cart.forEach(cartItem => {
        const cartItemElement = document.createElement("div");
        cartItemElement.className = "cart-item";
        cartItemElement.innerHTML = `
            <h3>${cartItem.product.title}</h3>
            <p>Price: $${cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price}</p>
            <p>Quantity: ${cartItem.quantity}</p>
            <button class="remove-from-cart" data-id="${cartItem.product.id}">Remove</button>
        `;
        cartList.appendChild(cartItemElement);

        cartItemElement.querySelector(".remove-from-cart").addEventListener("click", (event) => {
            const productId = event.target.getAttribute('data-id');
            console.log("Remove button clicked:", productId);
            removeFromCart(productId);
        });
    });

    calculateTotalPrice();

    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Checkout";
    checkoutButton.addEventListener("click", () => {
        window.location.href = "/Products/checkout/index.html";
    });
    cartList.appendChild(checkoutButton);
}

function calculateTotalPrice() {
    let total = 0;
    cart.forEach(cartItem => {
        total += (cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price) * cartItem.quantity;
    });
    document.getElementById("total-price").textContent = `Total: $${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        displayCart();
    }
}

document.getElementById("genre-dropdown").addEventListener("change", function() {
    const selectedGenre = this.value;
    if (selectedGenre === "all") {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.genre === selectedGenre);
        displayProducts(filteredProducts);
    }
});

fetchAllProducts();
loadCart();