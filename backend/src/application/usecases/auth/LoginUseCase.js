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

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Sai tài khoản hoặc mật khẩu', 401);
    }

if (user.status === USER_STATUS.LOCKED) {
      throw new AppError('Tài khoản đã bị khóa', 403);
    }

const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Sai tài khoản hoặc mật khẩu', 401);
    }

const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

const userData = user.toJSON();

    return {
      user: userData,
      accessToken,
      refreshToken
    };
  }
}
