document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productContainer");
    const paintingCount = document.getElementById("paintingCount");

    fetch('http://localhost:8080/api/products')
        .then(response => response.json())
        .then(data => {
            const products = data.content;
            paintingCount.textContent = products.length;

            products.forEach(product => {

                // Extract image filename from the URL
                const imageFilename = product.imageUrl.split('/').pop();
                // Create image URL with token
                const imageUrl = `http://localhost:8080/api/products/image/${imageFilename}`;
                const productCard = document.createElement('div');
                productCard.className = "col-md-4 mb-4";

                productCard.innerHTML = `
                        <div class="card h-100">
                            <img src="${imageUrl}" class="card-img-top" alt="${product.productName}">
                            <div class="card-body">
                                <h5 class="card-title">${product.productName}</h5>
                                <p class="card-text">${product.description.substring(0, 100)}...</p>
                                <p class="card-text"><strong>Style:</strong> ${product.style}</p>
                                <p class="card-text"><strong>Price:</strong> $${product.Price.toFixed(2)}</p>
                                <p class="card-text"><strong>Times Bought:</strong> ${product.timesBought}</p>
                            </div>
                        </div>
                    `;

                productContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
            productContainer.innerHTML = `<div class="alert alert-danger">Failed to load products.</div>`;
        });
});