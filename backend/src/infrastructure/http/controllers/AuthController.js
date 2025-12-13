import { LoginUseCase } from '../../../application/usecases/auth/LoginUseCase.js';
import { RegisterUseCase } from '../../../application/usecases/auth/RegisterUseCase.js';
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

  async register(req, res, next) {
    try {
      const registerUseCase = new RegisterUseCase();
      const user = await registerUseCase.execute(req.body);
      return successResponse(res, user, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      // req.user đã được set bởi authenticate middleware
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
}

