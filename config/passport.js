const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const authService = require('../services/auth.service');
const { v4: uuidv4 } = require('uuid');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authService.findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    // Check if user exists by email
    let user = await authService.findUserByEmail(profile.email);

    if (!user) {
      // Create new user if doesn't exist
      const userId = uuidv4();
      await authService.createVerifiedUser({
        id: userId,
        username: profile.username,
        email: profile.email,
        normalized_email: profile.email.toLowerCase(),
        password: await authService.generateRandomPassword(),
        is_verified: true
      });
      
      user = await authService.findUserById(userId);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));