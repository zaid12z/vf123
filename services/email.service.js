const transporter = require('../config/email');
const { generateVerificationCode } = require('../utils/verification');
const authService = require('./auth.service');

class EmailService {
  async sendVerificationCode(email, isLogin = false) {
    try {
      const code = generateVerificationCode();
      await authService.storeVerificationCode(email, code);
      
      const mailOptions = {
        from: `"VF1 Dev" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: isLogin ? 'Login Verification Code' : 'Complete Your Registration',
        html: this.createEmailTemplate(code, isLogin)
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Send verification email error:', error);
      throw error;
    }
  }

  createEmailTemplate(code, isLogin) {
    return `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #000000; font-size: 28px; margin: 0 0 10px;">
            ${isLogin ? 'Verify Your Login' : 'Welcome to VF1 Dev'}
          </h1>
          <p style="color: #666666; font-size: 16px; margin: 0;">
            ${isLogin ? 'Use this code to complete your login' : 'One last step to complete your registration'}
          </p>
        </div>

        <div style="background: #f8f8f8; border-radius: 16px; padding: 40px; text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; letter-spacing: 8px; color: #000000; font-weight: bold; 
                      background: white; padding: 20px; border-radius: 12px; display: inline-block;
                      border: 2px solid #eaeaea;">
            ${code}
          </div>
          <p style="color: #666666; font-size: 14px; margin-top: 20px;">
            This code will expire in 10 minutes
          </p>
        </div>

        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0;">
          <p style="color: #999999; font-size: 14px; margin: 0;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;
  }
}

module.exports = new EmailService();