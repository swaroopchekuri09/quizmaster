// controllers/attemptController.js
// Handles quiz attempt submission and retrieval

const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

/**
 * @route   POST /api/attempts/submit
 * @desc    Submit quiz answers - calculates score securely in backend
 * @access  Private (User)
 */
const submitAttempt = async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    // answers: [{ questionId, selectedAnswer }]

    if (!quizId || !answers) {
      return res.status(400).json({ message: 'Quiz ID and answers are required' });
    }

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Admins are not allowed to take quizzes
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot take quizzes' });
    }

    // Fetch all correct answers from the database (secure - never trust frontend)
    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
      return res.status(400).json({ message: 'No questions found for this quiz' });
    }

    // Build a map of questionId -> question for quick lookup
    const questionMap = {};
    questions.forEach((q) => { questionMap[q._id.toString()] = q; });

    // Calculate score by comparing answers
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    let totalMarks = 0;

    const processedAnswers = questions.map((question) => {
      const qId = question._id.toString();
      totalMarks += question.marks;

      // Find this question's answer in submitted answers
      const userAnswer = answers.find((a) => a.questionId === qId);
      const selected = userAnswer ? userAnswer.selectedAnswer : '';
      const isCorrect = selected && selected === question.correctAnswer;

      if (!selected || selected.trim() === '') {
        skippedCount++;
      } else if (isCorrect) {
        score += question.marks;
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        questionId: question._id,
        selectedAnswer: selected || '',
        isCorrect: !!isCorrect,
      };
    });

    const percentage = totalMarks > 0 ? ((score / totalMarks) * 100).toFixed(2) : 0;
    const isPassed = parseFloat(percentage) >= 40; // Pass threshold: 40%

    // Save the attempt to database
    const attempt = await Attempt.create({
      userId: req.user._id,
      quizId,
      answers: processedAnswers,
      score,
      totalMarks,
      correctCount,
      wrongCount,
      skippedCount,
      percentage: parseFloat(percentage),
      isPassed,
      timeTaken: timeTaken || 0,
    });

    // Populate and return full attempt with review data
    const populated = await Attempt.findById(attempt._id)
      .populate('quizId', 'title duration')
      .populate('userId', 'name email');

    // Also return questions with correct answers for review page
    const reviewQuestions = questions.map((q) => {
      const userAnswer = processedAnswers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );
      return {
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : '',
        isCorrect: userAnswer ? userAnswer.isCorrect : false,
      };
    });

    res.status(201).json({
      attempt: populated,
      reviewQuestions,
      summary: { score, totalMarks, correctCount, wrongCount, skippedCount, percentage, isPassed },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/attempts/my
 * @desc    Get all attempts by the logged-in user
 * @access  Private
 */
const getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user._id })
      .populate('quizId', 'title topic duration')
      .populate({ path: 'quizId', populate: { path: 'topic', select: 'name' } })
      .sort({ submittedAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/attempts/quiz/:quizId
 * @desc    Get all attempts for a specific quiz (admin view)
 * @access  Admin only
 */
const getAttemptsByQuiz = async (req, res) => {
  try {
    const attempts = await Attempt.find({ quizId: req.params.quizId })
      .populate('userId', 'name email')
      .populate('quizId', 'title')
      .sort({ score: -1, timeTaken: 1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/attempts/:id
 * @desc    Get a single attempt by ID (for result review)
 * @access  Private
 */
const getAttemptById = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
      .populate('quizId', 'title duration totalMarks')
      .populate('userId', 'name email');

    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    // Only the attempt owner or an admin can view it
    if (attempt.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this attempt' });
    }

    // Fetch questions WITH correct answers for review
    const questions = await Question.find({ quizId: attempt.quizId._id });
    const reviewQuestions = questions.map((q) => {
      const ans = attempt.answers.find((a) => a.questionId.toString() === q._id.toString());
      return {
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: q.marks,
        selectedAnswer: ans ? ans.selectedAnswer : '',
        isCorrect: ans ? ans.isCorrect : false,
      };
    });

    res.json({ attempt, reviewQuestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAttempt, getMyAttempts, getAttemptsByQuiz, getAttemptById };
