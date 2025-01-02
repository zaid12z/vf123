// Cart functionality
export function initCart() {
    setupCart();
    setupEventListeners();
}

let cartState = {
    items: [],
    total: 0
};

function setupCart() {
    loadCartFromStorage();
    updateCartDisplay();
}

function setupEventListeners() {
    const closeCart = document.getElementById('closeCart');
    const cartButton = document.getElementById('cartButton');
    
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    if (cartButton) {
        cartButton.addEventListener('click', toggleCart);
    }
}

// Rest of the cart functions remain the same, just add 'export' to the ones needed externally
export function addToCart(product) {
    const existingItem = cartState.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartState.items.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${product.name} تمت الإضافة إلى السلة`);
    toggleCart();
}