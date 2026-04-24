// controllers/quizController.js
// CRUD operations for quizzes

const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

/**
 * @route   GET /api/quizzes
 * @desc    Get all published quizzes (users) or all quizzes (admin)
 * @access  Public / Admin
 */
const getQuizzes = async (req, res) => {
  try {
    const { topic, search } = req.query;
    let filter = {};

    // Regular users can only see published quizzes
    if (!req.user || req.user.role !== 'admin') {
      filter.isPublished = true;
    }

    // Filter by topic if provided
    if (topic) filter.topic = topic;

    // Search by title if provided
    if (search) filter.title = { $regex: search, $options: 'i' };

    const quizzes = await Quiz.find(filter)
      .populate('topic', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get a single quiz by ID (without questions - questions fetched separately)
 * @access  Public
 */
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('topic', 'name description')
      .populate('createdBy', 'name');

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Count questions for this quiz
    const questionCount = await Question.countDocuments({ quizId: req.params.id });

    res.json({ ...quiz._doc, questionCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/quizzes
 * @desc    Create a new quiz
 * @access  Admin only
 */
const createQuiz = async (req, res) => {
  try {
    const { title, description, topic, duration } = req.body;
    if (!title || !topic || !duration) {
      return res.status(400).json({ message: 'Title, topic, and duration are required' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      topic,
      duration,
      createdBy: req.user._id,
    });

    const populated = await quiz.populate('topic', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/quizzes/:id
 * @desc    Update a quiz
 * @access  Admin only
 */
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('topic', 'name');

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Delete a quiz and its questions
 * @access  Admin only
 */
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Delete all questions associated with this quiz
    await Question.deleteMany({ quizId: req.params.id });

    res.json({ message: 'Quiz and its questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PATCH /api/quizzes/:id/publish
 * @desc    Toggle publish/unpublish a quiz
 * @access  Admin only
 */
const togglePublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();

    res.json({
      message: `Quiz ${quiz.isPublished ? 'published' : 'unpublished'} successfully`,
      isPublished: quiz.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz, togglePublish };
