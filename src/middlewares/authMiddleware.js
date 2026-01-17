const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError('Token tidak ada', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Format token salah', 401));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(err); // akan ditangani global handler
  }
};
