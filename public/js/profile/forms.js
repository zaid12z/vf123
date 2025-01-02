import { showNotification } from '../notifications.js';

export function initProfileForms() {
  const updateEmailForm = document.getElementById('updateEmailForm');
  const updatePasswordForm = document.getElementById('updatePasswordForm');

  if (updateEmailForm) {
    updateEmailForm.addEventListener('submit', handleEmailUpdate);
  }

  if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', handlePasswordUpdate);
  }
}

async function handleEmailUpdate(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;

  try {
    const response = await fetch('/profile/update-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    
    if (result.needsVerification) {
      showNotification('Please check your email for verification code', 'success');
      setTimeout(() => {
        window.location.href = `/auth/verify?email=${encodeURIComponent(result.email)}&type=email-update`;
      }, 1500);
    } else if (result.success) {
      showNotification('Email updated successfully', 'success');
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    showNotification('An error occurred', 'error');
  }
}

async function handlePasswordUpdate(e) {
  e.preventDefault();
  const form = e.target;
  
  const currentPassword = form.currentPassword.value;
  const newPassword = form.newPassword.value;
  const confirmPassword = form.confirmPassword.value;

  if (newPassword !== confirmPassword) {
    showNotification('New passwords do not match', 'error');
    return;
  }

  try {
    const response = await fetch('/profile/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const result = await response.json();
    
    if (result.success) {
      showNotification('Password updated successfully', 'success');
      form.reset();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    showNotification('An error occurred', 'error');
  }
}