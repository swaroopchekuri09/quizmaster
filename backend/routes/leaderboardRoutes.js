// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const {
  getOverallLeaderboard, getQuizLeaderboard, getTopicLeaderboard,
} = require('../controllers/leaderboardController');

router.get('/overall', getOverallLeaderboard);
router.get('/quiz/:quizId', getQuizLeaderboard);
router.get('/topic/:topicId', getTopicLeaderboard);

module.exports = router;
