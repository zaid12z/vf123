// Cart storage operations
export function loadCartFromStorage() {
    try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : { items: [], total: 0 };
    } catch (error) {
        console.error('Error loading cart:', error);
        return { items: [], total: 0 };
    }
}

export function saveCartToStorage(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}