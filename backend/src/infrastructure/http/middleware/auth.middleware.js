import { verifyToken } from '../../config/jwt.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';
import { UserRepository } from '../../database/repositories/UserRepository.js';

export const authenticate = async (req, res, next) => {
  try {
    let token;

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized to access this route', 401);
    }

const decoded = verifyToken(token);

const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      district: user.district,
      province: user.province
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(`User role '${req.user.role}' is not authorized to access this route`, 403));
    }

    next();
  };
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    let token;

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {

        const decoded = verifyToken(token);

const userRepository = new UserRepository();
        const user = await userRepository.findById(decoded.id);

        if (user) {

          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            district: user.district,
            province: user.province
          };
        }
      } catch (error) {

}
    }

    next();
  } catch (error) {
    next(error);
  }
};
