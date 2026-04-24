// middleware/errorHandler.js
// Global error handling middleware for Express

/**
 * Global error handler - catches all errors passed via next(error)
 * Returns consistent JSON error responses
 */
const errorHandler = (err, req, res, next) => {
  // Use status code from error or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`❌ Error: ${err.message}`);

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

/**
 * 404 Not Found handler - for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
