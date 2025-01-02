const db = require('../../config/database');
const { normalizeEmail } = require('../../utils/email');

class AuthDBService {
  async findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    const [users] = await db.query(
      'SELECT * FROM users WHERE normalized_email = ?',
      [normalizedEmail]
    );
    return users[0];
  }

  async findPendingUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    const [users] = await db.query(
      'SELECT * FROM pending_users WHERE normalized_email = ?',
      [normalizedEmail]
    );
    return users[0];
  }

  async createPendingUser(userData) {
    const { id, username, email, normalizedEmail, password } = userData;
    await db.query(
      `INSERT INTO pending_users (id, username, email, normalized_email, password) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, username, email, normalizedEmail, password]
    );
  }

  async verifyUser(email, code) {
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

      // Get pending user
      const [pendingUsers] = await conn.query(
        'SELECT * FROM pending_users WHERE email = ?',
        [email]
      );

      if (!pendingUsers.length) {
        throw new Error('User not found');
      }

      const user = pendingUsers[0];

      // Move to verified users
      await conn.query(
        `INSERT INTO users (id, username, email, normalized_email, password, is_verified) 
         VALUES (?, ?, ?, ?, ?, true)`,
        [user.id, user.username, user.email, user.normalized_email, user.password]
      );

      // Cleanup
      await conn.query('DELETE FROM pending_users WHERE id = ?', [user.id]);
      await conn.query('DELETE FROM verification_codes WHERE email = ?', [email]);

      await conn.commit();
      return { success: true, user };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
}

module.exports = new AuthDBService();