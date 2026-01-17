const { Prisma } = require('@prisma/client');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  /* ==========================
     PRISMA ERROR HANDLING
  ========================== */

  // Unique constraint (email duplikat)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 400;
      message = 'Data sudah terdaftar';
    }

    if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Data tidak ditemukan';
    }
  }

  /* ==========================
     JWT ERROR HANDLING
  ========================== */

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token sudah kedaluwarsa';
  }

  /* ==========================
     BODY / REQUEST ERROR
  ========================== */

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Format JSON tidak valid';
  }

  /* ==========================
     DEFAULT RESPONSE
  ========================== */

  res.status(statusCode).json({
    success: false,
    message
  });
};
