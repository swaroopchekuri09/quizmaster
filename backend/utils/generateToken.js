// utils/generateToken.js
// Utility to generate JWT tokens for authentication

const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {string} id - MongoDB user ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
