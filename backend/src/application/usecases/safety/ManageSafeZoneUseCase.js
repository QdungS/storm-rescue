import { SafetyRepository } from '../../../infrastructure/database/repositories/SafetyRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class ManageSafeZoneUseCase {
  constructor() {
    this.safetyRepository = new SafetyRepository();
  }

  async create(zoneData) {
    if (!zoneData.name || !zoneData.address) {
      throw new AppError('Name and address are required', 400);
    }
    return await this.safetyRepository.createSafeZone(zoneData);
  }

  async getAll(filters = {}) {

    return await this.safetyRepository.findAllSafeZones(filters);
  }

  async update(id, zoneData) {
    const zone = await this.safetyRepository.findSafeZoneById(id);
    if (!zone) {
      throw new AppError('Safe zone not found', 404);
    }
    return await this.safetyRepository.updateSafeZone(id, zoneData);
  }

  async delete(id) {
    const zone = await this.safetyRepository.findSafeZoneById(id);
    if (!zone) {
      throw new AppError('Safe zone not found', 404);
    }
    await this.safetyRepository.deleteSafeZone(id);
    return true;
  }
}
