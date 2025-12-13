import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class UpdateWarningUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(id, warningData, userRole = null, userDistrict = null, userProvince = null) {
    // Check if exists
    const existing = await this.warningRepository.findById(id);
    if (!existing) {
      throw new AppError('Warning not found', 404);
    }

    // Nếu là Officer, chỉ cho phép sửa các cảnh báo trong xã của họ
    if (userRole === ROLES.OFFICER && existing.district !== userDistrict) {
      throw new AppError('Bạn chỉ có quyền quản lý các cảnh báo trong xã/phường của mình', 403);
    }

    const { title, content, level, location, province, district } = warningData;

    // Nếu là Officer, tự động gán district và province của họ
    let finalProvince = province;
    let finalDistrict = district;
    if (userRole === ROLES.OFFICER) {
      finalProvince = userProvince;
      finalDistrict = userDistrict;
    }

    // Update warning
    const updated = await this.warningRepository.update(id, {
      title,
      content,
      level,
      location,
      province: finalProvince,
      district: finalDistrict
    });

    return updated;
  }
}

