// controllers/questionController.js
// CRUD operations for quiz questions

const Question = require('../models/Question');
const Quiz = require('../models/Quiz');

/**
 * @route   GET /api/questions/quiz/:quizId
 * @desc    Get all questions for a specific quiz
 *          For users: options only (no correct answer)
 *          For admins: full question data
 * @access  Private
 */
const getQuestionsByQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const questions = await Question.find({ quizId: req.params.quizId });

    // Hide correct answers from regular users during quiz
    if (req.user.role !== 'admin') {
      const sanitized = questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        marks: q.marks,
      }));
      return res.json(sanitized);
    }

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/questions
 * @desc    Add a question to a quiz
 * @access  Admin only
 */
const createQuestion = async (req, res) => {
  try {
    const { quizId, questionText, options, correctAnswer, marks } = req.body;

    if (!quizId || !questionText || !options || !correctAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: 'Exactly 4 options are required' });
    }

    // Verify quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const question = await Question.create({ quizId, questionText, options, correctAnswer, marks: marks || 1 });

    // Update totalMarks of the quiz
    const allQuestions = await Question.find({ quizId });
    const total = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(quizId, { totalMarks: total });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/questions/:id
 * @desc    Update a question
 * @access  Admin only
 */
const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Recalculate total marks for the quiz
    const allQuestions = await Question.find({ quizId: question.quizId });
    const total = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(question.quizId, { totalMarks: total });

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete a question
 * @access  Admin only
 */
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Recalculate total marks for the quiz
    const allQuestions = await Question.find({ quizId: question.quizId });
    const total = allQuestions.reduce((sum, q) => sum + q.marks, 0);
    await Quiz.findByIdAndUpdate(question.quizId, { totalMarks: total });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestionsByQuiz, createQuestion, updateQuestion, deleteQuestion };
