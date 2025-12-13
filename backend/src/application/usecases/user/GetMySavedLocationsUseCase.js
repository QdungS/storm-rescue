import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class GetMySavedLocationsUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user.savedLocations || [];
  }
}

