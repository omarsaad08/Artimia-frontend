
// Cart Management Functions
function getCart() {
    return JSON.parse(sessionStorage.getItem('cart')) || [];
}

function updateCart(cart) {
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
}

function updateCartCounter() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCounter').textContent = totalItems;
}

function calculateTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 50 : 0; // $50 shipping if items exist
    const total = subtotal + shipping;

    document.getElementById('itemCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('shipping').textContent = shipping.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartItemsContainer');

    if (cart.length === 0) {
        container.innerHTML = `
                    <div class="empty-cart text-center py-5">
                        <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                        <h4 class="mb-3">Your cart is empty</h4>
                        <a href="/screens/customer/allPaintings.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                `;
        calculateTotals();
        return;
    }

    container.innerHTML = cart.map(item => `
                <div class="cart-item p-3 d-flex mb-3" data-id="${item.id}">
                    <img src="http://localhost:8080${item.imageUrl}" class="cart-item-img me-3" alt="${item.name}">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between">
                            <h5>${item.name}</h5>
                            <button class="btn btn-link text-danger p-0 remove-item">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <p class="text-muted mb-2">$${item.price.toFixed(2)}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <button class="btn btn-outline-secondary px-3 decrease-quantity">-</button>
                                <input type="number" class="form-control quantity-input mx-2 text-center" 
                                       value="${item.quantity}" min="1" style="width: 60px;">
                                <button class="btn btn-outline-secondary px-3 increase-quantity">+</button>
                            </div>
                            <h5 class="mb-0">$${(item.price * item.quantity).toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
            `).join('');

    // Add event listeners
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-id'));
            const newCart = getCart().filter(item => item.id !== itemId);
            updateCart(newCart);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-id'));
            const cart = getCart();
            const item = cart.find(i => i.id === itemId);
            if (item.quantity > 1) {
                item.quantity--;
                updateCart(cart);
            }
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', function () {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-id'));
            const cart = getCart();
            const item = cart.find(i => i.id === itemId);
            item.quantity++;
            updateCart(cart);
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            const itemId = parseInt(this.closest('.cart-item').getAttribute('data-id'));
            const newQuantity = parseInt(this.value) || 1;
            const cart = getCart();
            const item = cart.find(i => i.id === itemId);
            item.quantity = Math.max(1, newQuantity);
            updateCart(cart);
        });
    });

    calculateTotals();
}

// Clear Cart
document.getElementById('clearCartBtn').addEventListener('click', function () {
    if (confirm('Are you sure you want to clear your cart?')) {
        updateCart([]);
    }
});

// Checkout Button
document.getElementById('checkoutBtn').addEventListener('click', function () {
    if (getCart().length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout!');
    const response = fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        body: JSON.stringify(getCart())
    });
    if (response.ok) {
        alert('Order placed successfully!');
        updateCart([]);
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    updateCartCounter();
    renderCart();
});
