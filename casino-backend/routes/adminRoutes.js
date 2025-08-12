const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Лише для адміна
router.get('/dashboard', protect, authorize('admin'), (req, res) => {
    res.json({ message: `Welcome admin ${req.user.username}` });
});

module.exports = router;
