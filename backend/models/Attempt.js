// models/Attempt.js
// Mongoose schema for storing quiz attempt results

const mongoose = require('mongoose');

// Sub-schema for each answered question
const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  selectedAnswer: {
    // The answer the user selected (empty string if skipped)
    type: String,
    default: '',
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    answers: [answerSchema], // Array of answers for each question
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    wrongCount: {
      type: Number,
      default: 0,
    },
    skippedCount: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    isPassed: {
      // Pass if percentage >= 40%
      type: Boolean,
      default: false,
    },
    timeTaken: {
      // Time taken in seconds
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
