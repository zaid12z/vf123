const authService = require('../services/auth.service');
const emailService = require('../services/email.service');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.validateLogin(email, password);
      
      if (result.needsVerification) {
        await emailService.sendVerificationCode(email, true);
        return res.json({
          success: false,
          needsVerification: true,
          email: email,
          type: 'login'
        });
      }

      if (!result.success) {
        return res.json({ success: false, error: result.error });
      }

      req.session.userId = result.user.id;
      req.session.username = result.user.username;
      
      res.json({ success: true });
    } catch (error) {
      console.error('Login error:', error);
      res.json({ success: false, error: 'An error occurred during login' });
    }
  }

  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const result = await authService.createPendingUser({ username, email, password });
      
      if (!result.success) {
        return res.json({ success: false, error: result.error });
      }

      await emailService.sendVerificationCode(email, false);
      res.json({ 
        success: false,
        needsVerification: true,
        email: email,
        type: 'register'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.json({ success: false, error: 'An error occurred during registration' });
    }
  }

  async verify(req, res) {
    try {
      const { email, code } = req.body;
      const isLogin = req.query.type === 'login';
      const result = await authService.verifyUser(email, code, isLogin);
      
      if (!result.success) {
        return res.json({ success: false, error: result.error });
      }

      req.session.userId = result.user.id;
      req.session.username = result.user.username;

      res.json({ success: true });
    } catch (error) {
      console.error('Verification error:', error);
      res.json({ success: false, error: 'An error occurred during verification' });
    }
  }

  async resendVerificationCode(req, res) {
    try {
      const { email } = req.body;
      const isLogin = req.query.type === 'login';
      await emailService.sendVerificationCode(email, isLogin);
      res.json({ success: true });
    } catch (error) {
      console.error('Resend code error:', error);
      res.json({ success: false, error: 'Failed to send verification code' });
    }
  }

  async logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.json({
          success: false,
          error: 'An error occurred during logout'
        });
      }
      res.json({ success: true });
    });
  }
}

module.exports = new AuthController();