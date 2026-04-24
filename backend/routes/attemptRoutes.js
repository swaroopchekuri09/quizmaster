// routes/attemptRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitAttempt, getMyAttempts, getAttemptsByQuiz, getAttemptById,
} = require('../controllers/attemptController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.post('/submit', protect, submitAttempt);
router.get('/my', protect, getMyAttempts);
router.get('/quiz/:quizId', protect, adminOnly, getAttemptsByQuiz);
router.get('/:id', protect, getAttemptById);

module.exports = router;
