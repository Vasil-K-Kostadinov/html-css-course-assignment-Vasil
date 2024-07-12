// script-product-detail.js

const apiUrl = "https://api.noroff.dev/api/v1/square-eyes";
let product = null; // Initialize as null to hold the fetched product details

// Fetch and display product details
async function fetchAndDisplayProductDetails(productId) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        product = await response.json();
        console.log("Fetched Product Details:", product);  // Log product details

        // Display product details on the page
        const productDetailsElement = document.getElementById("product-details");
        productDetailsElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" title="${product.name}">
            <h2>${product.title}</h2>
            <p>${product.genre}</p>
            <p><i class="fa-brands fa-imdb fa-2xl" style="color: #ffffff;"></i> ${product.rating}</p>
            <p>${product.released}</p>
            <p>${product.onSale ? `Sale: $${product.discountedPrice} Old price: $${product.price}` : `Price: $${product.price}`}</p>
            <p>${product.description}</p>
        `;

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Check if on product detail page and fetch/display product details if so
if (window.location.pathname.includes("index.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    fetchAndDisplayProductDetails(productId);
}
