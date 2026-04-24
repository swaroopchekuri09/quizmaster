// controllers/adminController.js
// Admin dashboard stats and analytics

const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Topic = require('../models/Topic');

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard analytics: users, quizzes, attempts, avg scores
 * @access  Admin only
 */
const getAdminStats = async (req, res) => {
  try {
    // Counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalQuizzes = await Quiz.countDocuments();
    const publishedQuizzes = await Quiz.countDocuments({ isPublished: true });
    const totalAttempts = await Attempt.countDocuments();
    const totalTopics = await Topic.countDocuments();

    // Average score across all attempts
    const scoreAgg = await Attempt.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' }, avgTime: { $avg: '$timeTaken' } } },
    ]);
    const avgScore = scoreAgg.length > 0 ? scoreAgg[0].avgScore.toFixed(2) : 0;
    const avgTime = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgTime) : 0;

    // Pass/fail count
    const passCount = await Attempt.countDocuments({ isPassed: true });
    const failCount = await Attempt.countDocuments({ isPassed: false });

    // Recent attempts (last 10)
    const recentAttempts = await Attempt.find()
      .populate('userId', 'name email')
      .populate('quizId', 'title')
      .sort({ submittedAt: -1 })
      .limit(10);

    // Top quizzes by attempt count
    const topQuizzes = await Attempt.aggregate([
      { $group: { _id: '$quizId', count: { $sum: 1 }, avgScore: { $avg: '$percentage' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'quizzes', localField: '_id', foreignField: '_id', as: 'quiz' } },
      { $unwind: '$quiz' },
      { $project: { quizTitle: '$quiz.title', count: 1, avgScore: { $round: ['$avgScore', 2] } } },
    ]);

    res.json({
      totalUsers,
      totalAdmins,
      totalQuizzes,
      publishedQuizzes,
      totalAttempts,
      totalTopics,
      avgScore,
      avgTime,
      passCount,
      failCount,
      recentAttempts,
      topQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    Get all users list
 * @access  Admin only
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getAllUsers };
