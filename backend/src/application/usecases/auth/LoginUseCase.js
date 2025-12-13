import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { comparePassword } from '../../../shared/utils/password.js';
import { generateToken, generateRefreshToken } from '../../../infrastructure/config/jwt.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { USER_STATUS } from '../../../shared/constants/roles.js';

export class LoginUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(email, password) {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if account is locked
    if (user.status === USER_STATUS.LOCKED) {
      throw new AppError('Account is locked. Please contact administrator', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Return user data without password
    const userData = user.toJSON();

    return {
      user: userData,
      accessToken,
      refreshToken
    };
  }
}

