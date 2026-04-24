// middleware/admin.js
// Admin Role Middleware - restricts access to admin-only routes
// Must be used AFTER the protect middleware

/**
 * Check if the authenticated user has admin role
 * Denies access if user is not an admin
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { adminOnly };
