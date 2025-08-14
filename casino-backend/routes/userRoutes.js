const express = require('express');
const router = express.Router();
const { depositBalance } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/deposit', protect, depositBalance);

module.exports = router;

