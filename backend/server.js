// server.js
// Main Express server entry point for QuizMaster backend

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ========================
// Middleware
// ========================
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ========================
// API Routes
// ========================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/topics', require('./routes/topicRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ QuizMaster API is running!', status: 'ok' });
});

// ========================
// Error Handling
// ========================
app.use(notFound);     // 404 for unknown routes
app.use(errorHandler); // Global error handler

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 QuizMaster Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
