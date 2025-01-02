let isCartOpen = false;

export function updateCartDisplay(cart) {
    updateCartCount(cart);
    updateCartItems(cart);
    updateCartTotal(cart);
}

function updateCartCount(cart) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const count = cart.items.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
}

function updateCartItems(cart) {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    if (cart.items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <svg class="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <p class="text-lg font-medium">Your cart is empty</p>
                <p class="text-sm">Add some products to start shopping</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="quantity-control">
                    <button onclick="window.cartActions.updateQuantity('${item.id}', ${item.quantity - 1})" 
                            class="quantity-btn">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button onclick="window.cartActions.updateQuantity('${item.id}', ${item.quantity + 1})" 
                            class="quantity-btn">+</button>
                </div>
                <button onclick="window.cartActions.removeFromCart('${item.id}')"
                        class="text-red-500 hover:text-red-700 text-sm mt-2">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
}

function updateCartTotal(cart) {
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

export function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (!cartSidebar || !overlay) return;

    if (!isCartOpen) {
        openCart();
    } else {
        closeCart();
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const body = document.body;

    cartSidebar.classList.add('show');
    overlay.classList.add('show');
    body.style.overflow = 'hidden';
    isCartOpen = true;

    overlay.addEventListener('click', closeCart);
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const body = document.body;

    cartSidebar.classList.remove('show');
    overlay.classList.remove('show');
    body.style.overflow = '';
    isCartOpen = false;

    overlay.removeEventListener('click', closeCart);
}