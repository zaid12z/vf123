const fetch = require('node-fetch');

class DiscordService {
  async getAccessToken(code) {
    try {
      const params = new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.DISCORD_CALLBACK_URL,
        scope: 'identify email guilds.join gdm.join'
      });

      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Discord token error: ${error}`);
      }

      return response.json();
    } catch (error) {
      console.error('Discord token error:', error);
      throw error;
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Discord user info error: ${error}`);
      }

      return response.json();
    } catch (error) {
      console.error('Discord user info error:', error);
      throw error;
    }
  }
}

module.exports = new DiscordService();