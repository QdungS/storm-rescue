import { LoginUseCase } from '../../../application/usecases/auth/LoginUseCase.js';
import { ForgotPasswordUseCase } from '../../../application/usecases/auth/ForgotPasswordUseCase.js';
import { ResetPasswordUseCase } from '../../../application/usecases/auth/ResetPasswordUseCase.js';
import { UserRepository } from '../../database/repositories/UserRepository.js';
import { successResponse, errorResponse } from '../../../shared/utils/response.js';

export class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const loginUseCase = new LoginUseCase();
      const result = await loginUseCase.execute(email, password);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {

      const userRepository = new UserRepository();
      const user = await userRepository.findById(req.user.id);
      if (!user) {
        return errorResponse(res, 'User not found', 404);
      }
      const userData = user.toJSON();
      return successResponse(res, userData, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const forgotPasswordUseCase = new ForgotPasswordUseCase();
      const result = await forgotPasswordUseCase.execute(email);
      return successResponse(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, code, newPassword } = req.body;
      const resetPasswordUseCase = new ResetPasswordUseCase();
      const result = await resetPasswordUseCase.execute({ email, code, newPassword });
      return successResponse(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }
}
