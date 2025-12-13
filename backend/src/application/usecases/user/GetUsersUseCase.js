import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository.js';

export class GetUsersUseCase {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(filters = {}) {
    const users = await this.userRepository.findAll(filters);
    return users.map(user => user.toJSON());
  }
}

