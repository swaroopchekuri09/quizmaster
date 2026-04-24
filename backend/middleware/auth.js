// middleware/auth.js
// JWT Authentication Middleware - protects routes that require login

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - verify JWT token from Authorization header
 * Adds req.user to the request if valid
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token is not valid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
};

module.exports = { protect };
