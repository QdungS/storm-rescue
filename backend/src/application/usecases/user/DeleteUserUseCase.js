import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class DeleteUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.userRepository.delete(userId);
    return true;
  }
}

