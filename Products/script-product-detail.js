const apiUrl = "https://api.noroff.dev/api/v1/square-eyes";
let product = null;

async function fetchAndDisplayProductDetails(productId) {
    try {
        const response = await fetch(`${apiUrl}/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        product = await response.json();
        console.log("Fetched Product Details:", product);

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

if (window.location.pathname.includes("index.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    fetchAndDisplayProductDetails(productId);
}
