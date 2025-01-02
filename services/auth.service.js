const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { normalizeEmail } = require('../utils/email');
const { validateEmail, validateUsername } = require('../utils/validation');
const authDB = require('./auth/db.service');
const verificationService = require('./auth/verification.service');

class AuthService {
  async validateLogin(email, password) {
    try {
      // Check if user exists
      const user = await authDB.findUserByEmail(email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Always require verification for login
      return { 
        success: false, 
        needsVerification: true,
        email: email,
        user: user
      };
    } catch (error) {
      throw error;
    }
  }

  async createPendingUser(userData) {
    try {
      const { username, email, password } = userData;

      if (!validateEmail(email) || !validateUsername(username)) {
        return { success: false, error: 'Invalid email or username format' };
      }

      const existingUser = await authDB.findUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const normalizedEmail = normalizeEmail(email);

      await authDB.createPendingUser({
        id: userId,
        username,
        email,
        normalizedEmail,
        password: hashedPassword
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(email, code, isLogin = false) {
    try {
      const isValidCode = await verificationService.verifyCode(email, code);
      if (!isValidCode) {
        return { success: false, error: 'Invalid or expired verification code' };
      }

      if (isLogin) {
        const user = await authDB.findUserByEmail(email);
        if (!user) {
          return { success: false, error: 'User not found' };
        }
        return { success: true, user };
      } else {
        return await authDB.verifyUser(email, code);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async storeVerificationCode(email, code) {
    return verificationService.storeVerificationCode(email, code);
  }
}

module.exports = new AuthService();