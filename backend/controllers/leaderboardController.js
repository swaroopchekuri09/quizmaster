// controllers/leaderboardController.js
// Leaderboard: ranked by highest score, then shortest time taken

const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');

/**
 * Helper: Build leaderboard from attempts array
 * Groups by user+quiz, picks best attempt per user per quiz
 */
const buildLeaderboard = (attempts) => {
  // Keep only the best attempt per user per quiz (highest score, then fastest time)
  const bestMap = {};
  attempts.forEach((a) => {
    const key = `${a.userId?._id}-${a.quizId?._id}`;
    if (!bestMap[key]) {
      bestMap[key] = a;
    } else {
      const existing = bestMap[key];
      if (a.score > existing.score || (a.score === existing.score && a.timeTaken < existing.timeTaken)) {
        bestMap[key] = a;
      }
    }
  });

  // Sort: score descending, timeTaken ascending
  return Object.values(bestMap)
    .sort((a, b) => b.score - a.score || a.timeTaken - b.timeTaken)
    .map((a, index) => ({
      rank: index + 1,
      userId: a.userId?._id,
      userName: a.userId?.name || 'Unknown',
      quizTitle: a.quizId?.title || 'Unknown',
      quizId: a.quizId?._id,
      score: a.score,
      totalMarks: a.totalMarks,
      percentage: a.percentage,
      timeTaken: a.timeTaken,
      isPassed: a.isPassed,
      submittedAt: a.submittedAt,
    }));
};

/**
 * @route   GET /api/leaderboard/overall
 * @desc    Overall leaderboard across all quizzes
 * @access  Public
 */
const getOverallLeaderboard = async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title topic');

    const leaderboard = buildLeaderboard(attempts);
    res.json(leaderboard.slice(0, 50)); // Top 50
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/leaderboard/quiz/:quizId
 * @desc    Leaderboard for a specific quiz
 * @access  Public
 */
const getQuizLeaderboard = async (req, res) => {
  try {
    const attempts = await Attempt.find({ quizId: req.params.quizId })
      .populate('userId', 'name email')
      .populate('quizId', 'title');

    const leaderboard = buildLeaderboard(attempts);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/leaderboard/topic/:topicId
 * @desc    Leaderboard for all quizzes under a topic
 * @access  Public
 */
const getTopicLeaderboard = async (req, res) => {
  try {
    // Find all quizzes under this topic
    const quizzes = await Quiz.find({ topic: req.params.topicId });
    const quizIds = quizzes.map((q) => q._id);

    const attempts = await Attempt.find({ quizId: { $in: quizIds } })
      .populate('userId', 'name email')
      .populate('quizId', 'title');

    const leaderboard = buildLeaderboard(attempts);
    res.json(leaderboard.slice(0, 50));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverallLeaderboard, getQuizLeaderboard, getTopicLeaderboard };
