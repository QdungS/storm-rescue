import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class CreateWarningUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(warningData) {
    const { title, content, level, location, province, district } = warningData;

    if (!title || !content) {
      throw new AppError('Title and content are required', 400);
    }

    const warning = await this.warningRepository.create({
      title,
      content,
      level: level || 'warning',
      location,
      province,
      district
    });

    return warning;
  }
}
