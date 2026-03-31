import { AppError } from '../../../shared/errors/AppError.js';
import { errorResponse } from '../../../shared/utils/response.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

console.error('Error:', err);

if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  return errorResponse(res, message, statusCode);
};
