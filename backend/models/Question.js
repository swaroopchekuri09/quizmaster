// models/Question.js
// Mongoose schema for MCQ Questions belonging to a Quiz

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required'],
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      // Array of exactly 4 answer choices
      type: [String],
      validate: {
        validator: function (val) {
          return val.length === 4;
        },
        message: 'Each question must have exactly 4 options',
      },
      required: [true, 'Options are required'],
    },
    correctAnswer: {
      // Store the correct answer text (one of the options)
      type: String,
      required: [true, 'Correct answer is required'],
    },
    marks: {
      // Marks awarded for this question
      type: Number,
      required: [true, 'Marks are required'],
      default: 1,
      min: [1, 'Marks must be at least 1'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
