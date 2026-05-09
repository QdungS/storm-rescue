import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { hashPassword } from '../../../shared/utils/password.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class CreateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData) {
    const { name, email, password, province, district, phone, role, status } = userData;

const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new AppError('User with this email already exists', 400);
    }

const hashedPassword = await hashPassword(password);

const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      province: province || undefined,
      district: district || undefined,
      phone: phone || undefined,
      role,
      status: status || 'active'
    });

    return user.toJSON();
  }
}
