import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class DeleteWarningUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(id, userRole = null, userDistrict = null) {
    // Check if exists
    const existing = await this.warningRepository.findById(id);
    if (!existing) {
      throw new AppError('Warning not found', 404);
    }

    // Nếu là Officer, chỉ cho phép xóa các cảnh báo trong xã của họ
    if (userRole === ROLES.OFFICER && existing.district !== userDistrict) {
      throw new AppError('Bạn chỉ có quyền quản lý các cảnh báo trong xã/phường của mình', 403);
    }

    // Delete warning
    await this.warningRepository.delete(id);
    return true;
  }
}

