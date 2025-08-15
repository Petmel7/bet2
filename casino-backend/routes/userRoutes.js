const express = require('express');
const router = express.Router();
const { depositBalance, paypalDeposit } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/deposit', protect, depositBalance);

router.post('/paypal-deposit', protect, paypalDeposit);

module.exports = router;

