// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const {
  getQuestionsByQuiz, createQuestion, updateQuestion, deleteQuestion,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/quiz/:quizId', protect, getQuestionsByQuiz);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
