export async function handleDiscordAuth(discordData) {
  try {
    const response = await fetch('/auth/discord/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(discordData),
      credentials: 'include'
    });

    const result = await response.json();
    
    if (result.success) {
      window.showNotification('Successfully logged in with Discord!', 'success');
      setTimeout(() => window.location.href = '/', 1500);
    } else {
      window.showNotification(result.error || 'Authentication failed', 'error');
    }
  } catch (error) {
    window.showNotification('An error occurred during authentication', 'error');
  }
}