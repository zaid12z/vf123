// Main cart module
import { loadCartFromStorage, saveCartToStorage } from './storage.js';
import { updateCartDisplay, toggleCart } from './ui.js';
import { showNotification } from '../notifications.js';

let cartState = loadCartFromStorage();

export function initCart() {
    setupEventListeners();
    updateCartDisplay(cartState);
    exposeCartActions();
}

function setupEventListeners() {
    const closeCart = document.getElementById('closeCart');
    const cartButton = document.getElementById('cartButton');
    const overlay = document.getElementById('cartOverlay');
    
    if (closeCart) closeCart.addEventListener('click', toggleCart);
    if (cartButton) cartButton.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    // Close cart on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            toggleCart();
        }
    });
}

export function addToCart(product) {
    const existingItem = cartState.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartState.items.push({ ...product, quantity: 1 });
    }
    
    saveCartToStorage(cartState);
    updateCartDisplay(cartState);
    showNotification(`${product.name} added to cart`);
    toggleCart();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
    } else {
        const item = cartState.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            saveCartToStorage(cartState);
            updateCartDisplay(cartState);
        }
    }
}

function removeFromCart(productId) {
    cartState.items = cartState.items.filter(item => item.id !== productId);
    saveCartToStorage(cartState);
    updateCartDisplay(cartState);
    showNotification('Item removed from cart');
}

function exposeCartActions() {
    window.cartActions = {
        addToCart,
        updateQuantity,
        removeFromCart
    };
}