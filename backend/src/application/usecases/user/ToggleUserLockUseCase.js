import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { USER_STATUS } from '../../../shared/constants/roles.js';

export class ToggleUserLockUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newStatus = user.status === USER_STATUS.ACTIVE
      ? USER_STATUS.LOCKED
      : USER_STATUS.ACTIVE;

    const updated = await this.userRepository.update(userId, { status: newStatus });
    return updated.toJSON();
  }
}
