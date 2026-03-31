import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class AddSavedLocationUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId, locationData) {
    const { name, type, lat, lng, address } = locationData;

    if (!name || lat === undefined || lng === undefined) {
      throw new AppError('Name, latitude and longitude are required', 400);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const location = {
      name,
      type: type || 'other',
      lat,
      lng,
      address: address || ''
    };

    const updated = await this.userRepository.addSavedLocation(userId, location);
    return updated.toJSON();
  }
}
