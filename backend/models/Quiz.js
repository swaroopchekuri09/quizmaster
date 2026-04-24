// models/Quiz.js
// Mongoose schema for Quiz

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: [true, 'Topic is required'],
    },
    duration: {
      // Duration in minutes
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    totalMarks: {
      // Calculated dynamically but stored for quick access
      type: Number,
      default: 0,
    },
    isPublished: {
      // Admin can publish/unpublish quizzes
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);
