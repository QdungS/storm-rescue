import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();
const authController = new AuthController();

router.post('/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  authController.login.bind(authController)
);

router.get('/me', authenticate, authController.getMe.bind(authController));

router.post('/forgot-password',
  [
    body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ')
  ],
  validateRequest,
  authController.forgotPassword.bind(authController)
);

router.post('/reset-password',
  [
    body('email').isEmail().withMessage('Vui lòng nhập email hợp lệ'),
    body('code').notEmpty().withMessage('Mã xác nhận là bắt buộc'),
    body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
  ],
  validateRequest,
  authController.resetPassword.bind(authController)
);

export default router;
