// Global variables
let currentPage = 1;
const itemsPerPage = 8;
let allPaintings = [];
let filteredPaintings = [];
let uniqueStyles = [];

// DOM Elements
const paintingsContainer = document.getElementById('paintingsContainer');
const pagination = document.getElementById('pagination');
const styleFilter = document.getElementById('styleFilter');
const priceFilter = document.getElementById('priceFilter');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const cartCounter = document.getElementById('cartCounter');

// Fetch paintings from the API
async function fetchPaintings() {
    try {
        const response = await fetch('http://localhost:8080/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allPaintings = data.content;
        filteredPaintings = [...allPaintings];

        // Extract unique styles for filter dropdown
        uniqueStyles = [...new Set(allPaintings.map(painting => painting.style))];
        populateStyleFilter();

        renderPaintings();
        renderPagination();
        updateCartCounter();
    } catch (error) {
        console.error('Error fetching paintings:', error);
        paintingsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p class="text-danger">Failed to load paintings. Please try again later.</p>
                    </div>
                `;
    }
}

// Get current cart from sessionStorage
function getCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

// Update cart counter in navbar
function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalItems;
}

// Populate style filter dropdown
function populateStyleFilter() {
    styleFilter.innerHTML = `
                <option value="" selected>All Styles</option>
                ${uniqueStyles.map(style => `
                    <option value="${style}">${style}</option>
                `).join('')}
            `;
}

// Filter paintings based on selected filters
function filterPaintings() {
    const selectedStyle = styleFilter.value;
    const selectedPriceRange = priceFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    filteredPaintings = allPaintings.filter(painting => {
        // Style filter
        if (selectedStyle && painting.style !== selectedStyle) {
            return false;
        }

        // Price range filter
        if (selectedPriceRange) {
            const [min, max] = selectedPriceRange.split('-').map(Number);
            if (painting.Price < min || painting.Price > max) {
                return false;
            }
        }

        // Search filter
        if (searchTerm &&
            !painting.productName.toLowerCase().includes(searchTerm) &&
            !painting.description.toLowerCase().includes(searchTerm)) {
            return false;
        }

        return true;
    });

    // Sort paintings
    sortPaintings();

    // Reset to first page
    currentPage = 1;
    renderPaintings();
    renderPagination();
}

// Sort paintings based on selected option
function sortPaintings() {
    const sortOption = sortBy.value;

    if (sortOption === 'timesBought') {
        filteredPaintings.sort((a, b) => b.timesBought - a.timesBought);
    } else if (sortOption === 'Id') {
        filteredPaintings.sort((a, b) => b.Id - a.Id);
    } else if (sortOption === 'Price-asc') {
        filteredPaintings.sort((a, b) => a.Price - b.Price);
    } else if (sortOption === 'Price-desc') {
        filteredPaintings.sort((a, b) => b.Price - a.Price);
    }
}

// Render paintings for the current page
function renderPaintings() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paintingsToShow = filteredPaintings.slice(startIndex, endIndex);

    if (paintingsToShow.length === 0) {
        paintingsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p>No paintings found matching your criteria.</p>
                    </div>
                `;
        return;
    }

    paintingsContainer.innerHTML = paintingsToShow.map(painting => {
        // Extract image filename from the URL
        const imageFilename = painting.imageUrl.split('/').pop();
        // Create image URL with token
        const imageUrl = `http://localhost:8080/api/products/image/${imageFilename}`;

        return `
                <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card artwork-card h-100">
                        <div class="position-relative">
                            <img src="${imageUrl}" class="artwork-img" alt="${painting.productName}">
                            <button class="wishlist-btn" data-id="${painting.Id}">
                                <i class="far fa-heart"></i>
                            </button>
                            <span class="artwork-status bg-success">Available</span>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${painting.productName}</h5>
                            <p class="card-text text-muted">${painting.style} • ${painting.description.substring(0, 50)}...</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="price-tag">$${painting.Price.toFixed(2)}</span>
                                <button class="btn btn-sm btn-primary add-to-cart" data-id="${painting.Id}">
                                    <i class="fas fa-shopping-cart me-1"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }).join('');

    // Add event listeners to the newly created elements
    addEventListeners();
}

// Render pagination controls
function renderPagination() {
    const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                </li>
            `;

    // Show limited page numbers with ellipsis
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
                    <li class="page-item">
                        <a class="page-link" href="#" data-page="1">1</a>
                    </li>
                    ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                `;
    }

    if (endPage < totalPages) {
        paginationHTML += `
                    ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                    <li class="page-item">
                        <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                    </li>
                `;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                </li>
            `;

    pagination.innerHTML = paginationHTML;

    // Add event listeners to pagination links
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (page !== currentPage) {
                currentPage = page;
                renderPaintings();
                window.scrollTo({
                    top: paintingsContainer.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add to cart function
function addToCart(productId) {
    const product = allPaintings.find(p => p.Id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
        alert(`Added another ${product.productName} to your cart`);
    } else {
        cart.push({
            id: product.Id,
            name: product.productName,
            price: product.Price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
        alert(`${product.productName} added to cart`);
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

// Add event listeners to interactive elements
function addEventListeners() {
    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            const icon = this.querySelector('i');

            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                addToWishlist(productId);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                removeFromWishlist(productId);
            }
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add to wishlist function
async function addToWishlist(productId) {
    try {
        // You would typically send a request to your backend here
        console.log(`Added product ${productId} to wishlist`);
        alert('Added to wishlist');
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        alert('Failed to add to wishlist');
    }
}

// Remove from wishlist function
async function removeFromWishlist(productId) {
    try {
        // You would typically send a request to your backend here
        console.log(`Removed product ${productId} from wishlist`);
        alert('Removed from wishlist');
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        alert('Failed to remove from wishlist');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    fetchPaintings();

    // Add event listeners to filter controls
    styleFilter.addEventListener('change', filterPaintings);
    priceFilter.addEventListener('change', filterPaintings);
    sortBy.addEventListener('change', filterPaintings);
    searchButton.addEventListener('click', filterPaintings);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            filterPaintings();
        }
    });
});