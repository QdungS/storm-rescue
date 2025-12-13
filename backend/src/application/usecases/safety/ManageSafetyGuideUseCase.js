import { SafetyRepository } from '../../../infrastructure/database/repositories/SafetyRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class ManageSafetyGuideUseCase {
  constructor() {
    this.safetyRepository = new SafetyRepository();
  }

  async create(guideData) {
    if (!guideData.title || !guideData.content) {
      throw new AppError('Title and content are required', 400);
    }
    return await this.safetyRepository.createGuide(guideData);
  }

  async getAll(filters = {}) {
    return await this.safetyRepository.findAllGuides(filters);
  }

  async update(id, guideData) {
    const guide = await this.safetyRepository.findGuideById(id);
    if (!guide) {
      throw new AppError('Safety guide not found', 404);
    }
    return await this.safetyRepository.updateGuide(id, guideData);
  }

  async delete(id) {
    const guide = await this.safetyRepository.findGuideById(id);
    if (!guide) {
      throw new AppError('Safety guide not found', 404);
    }
    await this.safetyRepository.deleteGuide(id);
    return true;
  }
}

