import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { hashPassword } from '../../../shared/utils/password.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class CreateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData) {
    const { name, email, password, cccd, province, district, phone, role, status } = userData;

    // Check if user already exists by email
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 400);
    }

    // Check if CCCD already exists (nếu có CCCD)
    if (cccd) {
      const existingUserByCCCD = await this.userRepository.findByCCCD(cccd);
      if (existingUserByCCCD) {
        throw new AppError('Số căn cước công dân này đã được sử dụng bởi tài khoản khác', 400);
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      cccd: cccd || undefined,
      province: province || undefined,
      district: district || undefined,
      phone: phone || undefined,
      role,
      status: status || 'active'
    });

    return user.toJSON();
  }
}

