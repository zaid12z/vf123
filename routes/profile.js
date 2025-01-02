const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

router.get('/', ensureAuthenticated, profileController.getProfile);
router.post('/update-password', ensureAuthenticated, profileController.updatePassword);
router.post('/update-email', ensureAuthenticated, profileController.updateEmail);

module.exports = router;