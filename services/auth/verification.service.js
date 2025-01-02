const db = require('../../config/database');

class VerificationService {
  async storeVerificationCode(email, code) {
    await db.query(
      `INSERT INTO verification_codes (email, code, expires_at) 
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))
       ON DUPLICATE KEY UPDATE 
       code = VALUES(code), 
       expires_at = VALUES(expires_at)`,
      [email, code]
    );
  }

  async verifyCode(email, code) {
    const [codes] = await db.query(
      'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND expires_at > NOW()',
      [email, code]
    );
    return codes.length > 0;
  }
}

module.exports = new VerificationService();