import { initCart } from './cart/index.js';
import { initMobileMenu } from './mobile-menu.js';
import { showNotification, initNotifications } from './notifications.js';
import { initAuthUI } from './auth/ui.js';

// Expose showNotification globally
window.showNotification = showNotification;

document.addEventListener('DOMContentLoaded', () => {
    initializeModules();
});

function initializeModules() {
    initNotifications();
    initAuthUI();
    initCart();
    initMobileMenu();
}