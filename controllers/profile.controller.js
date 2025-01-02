const profileService = require('../services/profile.service');
const emailService = require('../services/email.service');

class ProfileController {
  async getProfile(req, res) {
    try {
      const user = await profileService.getUserProfile(req.session.userId);
      res.render('pages/profile', {
        title: 'Profile',
        user
      });
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).render('error', {
        message: 'Error loading profile'
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await profileService.updatePassword(
        req.session.userId,
        currentPassword,
        newPassword
      );
      res.json(result);
    } catch (error) {
      console.error('Update password error:', error);
      res.json({
        success: false,
        error: 'Failed to update password'
      });
    }
  }

  async updateEmail(req, res) {
    try {
      const { email } = req.body;
      const result = await profileService.initiateEmailUpdate(req.session.userId, email);
      
      if (result.success) {
        await emailService.sendVerificationCode(email, false);
        res.json({
          success: false,
          needsVerification: true,
          email,
          type: 'email-update'
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error('Update email error:', error);
      res.json({
        success: false,
        error: 'Failed to update email'
      });
    }
  }
}

module.exports = new ProfileController();