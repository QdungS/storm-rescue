import { LandslideRepository } from '../../../infrastructure/database/repositories/LandslideRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class DeleteLandslideUseCase {
  constructor() {
    this.landslideRepository = new LandslideRepository();
  }

  async execute(id, userRole = null, userDistrict = null) {
    // Check if exists
    const existing = await this.landslideRepository.findById(id);
    if (!existing) {
      throw new AppError('Landslide point not found', 404);
    }

    // Nếu là Officer, chỉ cho phép xóa các điểm trong xã của họ
    if (userRole === ROLES.OFFICER && existing.district !== userDistrict) {
      throw new AppError('Bạn chỉ có quyền quản lý các điểm sạt lở trong xã/phường của mình', 403);
    }

    // Delete
    await this.landslideRepository.delete(id);
    return true;
  }
}

