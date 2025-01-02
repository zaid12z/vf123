import { showNotification } from '../notifications.js';
import { setupUserMenu } from './menu.service.js';

export function initAuthUI() {
    setupFormSubmission('form[action="/auth/login"]', '/auth/login');
    setupFormSubmission('form[action="/auth/register"]', '/auth/register');
    setupUserMenu();
    updateAuthUI();
}

function updateAuthUI() {
    fetch('/auth/check')
        .then(res => res.json())
        .then(data => {
            const authButtons = document.querySelector('[data-auth-buttons]');
            const userMenu = document.querySelector('[data-user-menu]');
            const usernameSpan = document.querySelector('.username');
            
            if (data.isAuthenticated) {
                if (authButtons) authButtons.classList.add('hidden');
                if (userMenu) {
                    userMenu.classList.remove('hidden');
                    if (usernameSpan) {
                        usernameSpan.textContent = data.username;
                    }
                }
            } else {
                if (authButtons) authButtons.classList.remove('hidden');
                if (userMenu) userMenu.classList.add('hidden');
            }
        })
        .catch(console.error);
}

function setupFormSubmission(formSelector, endpoint) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await response.json();
            
            if (result.needsVerification) {
                showNotification('Please check your email for verification code', 'success');
                setTimeout(() => {
                    const verifyUrl = `/auth/verify?email=${encodeURIComponent(result.email)}&type=${result.type}`;
                    window.location.href = verifyUrl;
                }, 1500);
            } else if (result.success) {
                showNotification('Success! Redirecting...', 'success');
                setTimeout(() => window.location.href = '/', 1500);
            } else {
                showNotification(result.error || 'An error occurred', 'error');
            }
        } catch (error) {
            showNotification('An error occurred. Please try again.', 'error');
        }
    });
}