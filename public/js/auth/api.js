// Authentication API calls
import { supabase } from './supabase.js';

export async function signUp(email, password, username) {
  try {
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username // Store username in user metadata
        }
      }
    });

    if (authError) throw authError;

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email,
        username
      }]);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signIn(email, password) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signInWithDiscord() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}