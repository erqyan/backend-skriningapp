const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new AppError('Akses admin saja', 403));
  }
  next();
};
