const jwt = require('jsonwebtoken');

const JWT_SECRET = 'shelfsafe-secret-key';

module.exports = function authMiddleware(req, res, next) {
  // Get token from request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // No token — block access
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // allow request to continue
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};