import { supabase } from './supabase.js';

// Auth state management
let currentUser = null;

export function getCurrentUser() {
  return currentUser;
}

export async function initAuthState() {
  // Get initial session
  const { data: { session } } = await supabase.auth.getSession();
  currentUser = session?.user || null;

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    updateUI();
  });
}

function updateUI() {
  const authButtons = document.querySelectorAll('[data-auth-button]');
  const userMenu = document.querySelector('[data-user-menu]');
  
  if (currentUser) {
    authButtons.forEach(btn => btn.style.display = 'none');
    if (userMenu) userMenu.style.display = 'block';
  } else {
    authButtons.forEach(btn => btn.style.display = 'block');
    if (userMenu) userMenu.style.display = 'none';
  }
}