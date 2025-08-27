const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/resend-verification', authController.resendVerification);

router.get('/me', protect, authController.getCurrentUser);

// refresh token endpoint (reads refresh token from cookie)
router.post('/refresh-token', authController.refreshToken);

// logout
router.post('/logout', authController.logout);

module.exports = router;
