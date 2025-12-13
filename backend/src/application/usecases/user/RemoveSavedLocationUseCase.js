import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class RemoveSavedLocationUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId, locationId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await this.userRepository.removeSavedLocation(userId, locationId);
    return updated.toJSON();
  }
}

