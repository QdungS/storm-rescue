import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class UpdateWarningUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(id, warningData) {
    const existing = await this.warningRepository.findById(id);
    if (!existing) {
      throw new AppError('Warning not found', 404);
    }

    const { title, content, level, location, province, district } = warningData;

    const updated = await this.warningRepository.update(id, {
      title,
      content,
      level,
      location,
      province,
      district
    });

    return updated;
  }
}
