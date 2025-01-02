/**
 * Generate a random 6-digit verification code
 * @returns {string}
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create registration verification email template
 * @param {string} code 
 * @returns {string}
 */
function createRegistrationEmailTemplate(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">Welcome to VF1 Dev!</h1>
        <p style="color: #6B7280; margin-top: 10px;">Thank you for creating an account</p>
      </div>
      
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
          To complete your registration, please enter this verification code:
        </p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${code}</span>
        </div>
        
        <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
          This code will expire in 10 minutes for security purposes.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px;">
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    </div>
  `;
}

/**
 * Create login verification email template
 * @param {string} code 
 * @returns {string}
 */
function createLoginEmailTemplate(code) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4F46E5; margin: 0;">Login Verification</h1>
        <p style="color: #6B7280; margin-top: 10px;">Secure your VF1 Dev account</p>
      </div>
      
      <div style="background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
          We noticed a login attempt to your account. To proceed, please enter this verification code:
        </p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5;">${code}</span>
        </div>
        
        <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
          This code will expire in 10 minutes. If you didn't attempt to log in, please change your password immediately.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 14px;">
        <p>This is an automated message, please do not reply.</p>
      </div>
    </div>
  `;
}

module.exports = {
  generateVerificationCode,
  createRegistrationEmailTemplate,
  createLoginEmailTemplate
};