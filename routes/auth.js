const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { ensureGuest } = require('../middleware/auth.middleware');

// Login page
router.get('/login', ensureGuest, (req, res) => {
  res.render('pages/auth/login', { 
    title: 'Login',
    error: req.query.error
  });
});

// Register page
router.get('/register', ensureGuest, (req, res) => {
  res.render('pages/auth/register', { 
    title: 'Register',
    error: req.query.error
  });
});

// Verify page
router.get('/verify', ensureGuest, (req, res) => {
  const email = req.query.email;
  const type = req.query.type || 'register';
  
  if (!email) {
    return res.redirect('/auth/login');
  }
  
  res.render('pages/auth/verify', {
    title: 'Verify Email',
    email,
    type
  });
});

// Auth endpoints
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify', authController.verify);
router.post('/resend-code', authController.resendVerificationCode);
router.post('/logout', authController.logout);

// Auth status check
router.get('/check', (req, res) => {
  res.json({
    isAuthenticated: !!req.session.userId,
    username: req.session.username
  });
});

module.exports = router;