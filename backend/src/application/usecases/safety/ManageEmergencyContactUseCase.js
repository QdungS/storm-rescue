import { SafetyRepository } from '../../../infrastructure/database/repositories/SafetyRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class ManageEmergencyContactUseCase {
  constructor() {
    this.safetyRepository = new SafetyRepository();
  }

  async create(contactData) {
    if (!contactData.name || !contactData.phone) {
      throw new AppError('Name and phone are required', 400);
    }
    return await this.safetyRepository.createContact(contactData);
  }

  async getAll(filters = {}) {

    return await this.safetyRepository.findAllContacts(filters);
  }

  async update(id, contactData) {
    const contact = await this.safetyRepository.findContactById(id);
    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }
    return await this.safetyRepository.updateContact(id, contactData);
  }

  async delete(id) {
    const contact = await this.safetyRepository.findContactById(id);
    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }
    await this.safetyRepository.deleteContact(id);
    return true;
  }
}
