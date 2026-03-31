import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class DeleteWarningUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(id) {
    const existing = await this.warningRepository.findById(id);
    if (!existing) {
      throw new AppError('Warning not found', 404);
    }

    await this.warningRepository.delete(id);
    return true;
  }
}
