import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { mailService } from '../../../infrastructure/services/MailService.js';

export class ForgotPasswordUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Không tìm thấy tài khoản với email này', 404);
    }

const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

await this.userRepository.update(user.id, {
      resetPasswordCode: resetCode,
      resetPasswordExpires: resetExpires
    });

try {
      await mailService.sendResetCode(email, resetCode);
    } catch (error) {
      console.error('Failed to send email:', error);

      console.log(`MÃ DỰ PHÒNG (CONSOLE): ${resetCode}`);

}

    return { success: true, message: 'Mã xác nhận đã được gửi đến email của bạn' };
  }
}
