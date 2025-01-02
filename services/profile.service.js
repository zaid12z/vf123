const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { normalizeEmail } = require('../utils/email');
const { validateEmail } = require('../utils/validation');

class ProfileService {
  async getUserProfile(userId) {
    const [users] = await db.query(
      'SELECT id, username, email FROM users WHERE id = ?',
      [userId]
    );
    return users[0];
  }

  async updatePassword(userId, currentPassword, newPassword) {
    try {
      // Get current user
      const [users] = await db.query(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );
      
      if (!users.length) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
      if (!isValidPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async initiateEmailUpdate(userId, newEmail) {
    try {
      if (!validateEmail(newEmail)) {
        return { success: false, error: 'Invalid email format' };
      }

      const normalizedEmail = normalizeEmail(newEmail);
      
      // Check if email is already in use
      const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE normalized_email = ? AND id != ?',
        [normalizedEmail, userId]
      );

      if (existingUsers.length) {
        return { success: false, error: 'Email already in use' };
      }

      // Store pending email update
      await db.query(
        `INSERT INTO pending_email_updates (user_id, new_email, normalized_email)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         new_email = VALUES(new_email),
         normalized_email = VALUES(normalized_email)`,
        [userId, newEmail, normalizedEmail]
      );

      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  async completeEmailUpdate(userId, email, code) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Verify code
      const [codes] = await conn.query(
        'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND expires_at > NOW()',
        [email, code]
      );

      if (!codes.length) {
        throw new Error('Invalid or expired verification code');
      }

      // Update email
      await conn.query(
        `UPDATE users 
         SET email = ?, normalized_email = ?
         WHERE id = ?`,
        [email, normalizeEmail(email), userId]
      );

      // Cleanup
      await conn.query('DELETE FROM verification_codes WHERE email = ?', [email]);
      await conn.query('DELETE FROM pending_email_updates WHERE user_id = ?', [userId]);

      await conn.commit();
      return { success: true };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}

module.exports = new ProfileService();