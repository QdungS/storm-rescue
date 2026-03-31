import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { hashPassword } from '../../../shared/utils/password.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { UserModel } from '../../../infrastructure/database/mongoose/models/UserModel.js';

export class ResetPasswordUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute({ email, code, newPassword }) {

const userDoc = await UserModel.findOne({
      email: email.toLowerCase(),
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!userDoc) {
      throw new AppError('Mã xác nhận không hợp lệ hoặc đã hết hạn', 400);
    }

const hashedPassword = await hashPassword(newPassword);

userDoc.password = hashedPassword;
    userDoc.resetPasswordCode = undefined;
    userDoc.resetPasswordExpires = undefined;
    await userDoc.save();

    return { success: true, message: 'Mật khẩu đã được thay đổi thành công' };
  }
}
