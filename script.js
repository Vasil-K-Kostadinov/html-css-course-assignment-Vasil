const apiUrl = "https://api.noroff.dev/api/v1/square-eyes";
let products = [];
let cart = [];

// Fetch all products from the API
async function fetchAllProducts() {
    try {
        const response = await fetch(apiUrl);
        console.log("Response status:", response.status);  // Print the response status
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        products = await response.json();
        console.log("Fetched Products JSON:", products);  // Print the JSON data to the console
        populateGenreDropdown(products);
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        showToast("Failed to load products. Please try again later.");
    }   
}

// Populate the genre dropdown
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

// Display products on the page
function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";  // Clear the current list

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

        // Add event listener for Add to Cart button
        productItem.querySelector(".add-to-cart").addEventListener("click", () => {
            addToCart(product.id);
        });
    });
}

// Add a product to the cart
function addToCart(productId) {
    console.log("Adding to cart:", productId);  // Log productId to verify it's called
    const product = products.find(product => product.id === productId);
    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    const cartItem = cart.find(item => item.product.id === productId);

    if (cartItem) {
        // Product already exists in cart, show confirmation prompt
        const confirmAdd = confirm("This product is already in your cart. Are you sure you want another one?");
        if (confirmAdd) {
            cartItem.quantity++;
        } else {
            return; // Do nothing if user cancels
        }
    } else {
        cart.push({ product, quantity: 1 });
    }

    console.log("Current cart:", cart);  // Log cart to verify its contents
    displayCart();
    saveCart();  // Save cart to local storage
}

// Remove a product from the cart
function removeFromCart(productId) {
    console.log("Removing from cart:", productId);  // Debugging log
    cart = cart.filter(cartItem => cartItem.product.id !== productId);
    displayCart();
    saveCart();  // Save cart to local storage
}

// Display the cart's contents
function displayCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";  // Clear the current cart list

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

        // Add event listener for Remove from Cart button
        cartItemElement.querySelector(".remove-from-cart").addEventListener("click", (event) => {
            const productId = event.target.getAttribute('data-id');
            console.log("Remove button clicked:", productId);  // Debugging log
            removeFromCart(productId);
        });
    });

    calculateTotalPrice();  // Update total price

    // Add Checkout button
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Checkout";
    checkoutButton.addEventListener("click", () => {
        window.location.href = "/Products/checkout/index.html";
    });
    cartList.appendChild(checkoutButton);
}

// Calculate and display total price
function calculateTotalPrice() {
    let total = 0;
    cart.forEach(cartItem => {
        total += (cartItem.product.onSale ? cartItem.product.discountedPrice : cartItem.product.price) * cartItem.quantity;
    });
    document.getElementById("total-price").textContent = `Total: $${total.toFixed(2)}`;
}

// Save cart to local storage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from local storage
function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        displayCart();
    }
}

// Event listener for genre dropdown change
document.getElementById("genre-dropdown").addEventListener("change", function() {
    const selectedGenre = this.value;
    if (selectedGenre === "all") {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.genre === selectedGenre);
        displayProducts(filteredProducts);
    }
});

// Initialize the application
fetchAllProducts();
loadCart();  // Load cart from local storage on page load
