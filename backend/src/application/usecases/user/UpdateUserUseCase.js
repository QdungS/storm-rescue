import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class UpdateUserUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId, userData) {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow updating password through this endpoint
    const { password, ...updateData } = userData;
    
    const updated = await this.userRepository.update(userId, updateData);
    return updated.toJSON();
  }
}

