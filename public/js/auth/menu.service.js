export function setupUserMenu() {
  const userMenuButton = document.querySelector('#userMenuButton');
  const userMenu = document.querySelector('#userMenu');
  
  if (!userMenuButton || !userMenu) return;

  // Toggle menu on button click
  userMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('hidden');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!userMenu.contains(e.target) && !userMenuButton.contains(e.target)) {
      userMenu.classList.add('hidden');
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !userMenu.classList.contains('hidden')) {
      userMenu.classList.add('hidden');
    }
  });

  // Setup logout button
  const logoutButton = userMenu.querySelector('[data-logout-button]');
  if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
  }
}

async function handleLogout() {
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
    console.error('Logout error:', error);
  }
}