import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';

export class GetWarningsUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(filters = {}) {

    return await this.warningRepository.findAll(filters);
  }
}
