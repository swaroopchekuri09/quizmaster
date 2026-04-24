// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const {
  getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, togglePublish,
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// Public routes (optional auth to distinguish user vs admin in getQuizzes)
router.get('/', (req, res, next) => {
  // Attach user if token present, but don't require it
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err && decoded) {
        req.user = await User.findById(decoded.id).select('-password');
      }
      next();
    });
  } else {
    next();
  }
}, getQuizzes);

router.get('/:id', getQuizById);

// Admin-only routes
router.post('/', protect, adminOnly, createQuiz);
router.put('/:id', protect, adminOnly, updateQuiz);
router.delete('/:id', protect, adminOnly, deleteQuiz);
router.patch('/:id/publish', protect, adminOnly, togglePublish);

module.exports = router;
