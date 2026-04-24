// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/stats', protect, adminOnly, getAdminStats);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
