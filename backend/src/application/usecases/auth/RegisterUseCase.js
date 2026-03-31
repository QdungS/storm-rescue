import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { hashPassword } from '../../../shared/utils/password.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class RegisterUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData) {
    const { name, email, password, cccd, province, district, phone, role = ROLES.CITIZEN } = userData;

const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('Email này đã được sử dụng bởi tài khoản khác', 400);
    }

if (cccd) {
      const existingUserByCCCD = await this.userRepository.findByCCCD(cccd);
      if (existingUserByCCCD) {
        throw new AppError('Số căn cước công dân này đã được sử dụng bởi tài khoản khác', 400);
      }
    }

const hashedPassword = await hashPassword(password);

const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      cccd: cccd || undefined,
      province: province || undefined,
      district: district || undefined,
      phone: phone || undefined,
      role
    });

return user.toJSON();
  }
}
