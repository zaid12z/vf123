import { showNotification } from '../notifications.js';

export async function login(email, password) {
  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = '/';
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    showNotification('An error occurred during login', 'error');
  }
}

export async function register(username, email, password) {
  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      if (result.needsVerification) {
        window.location.href = `/auth/verify?email=${encodeURIComponent(result.email)}`;
      } else {
        window.location.href = '/';
      }
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    showNotification('An error occurred during registration', 'error');
  }
}

export async function signOut() {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = '/auth/login';
    }
  } catch (error) {
    console.error('Error signing out:', error);
  }
}