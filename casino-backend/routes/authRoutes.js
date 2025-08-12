
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, verifyEmail, resendVerification, getMe } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
