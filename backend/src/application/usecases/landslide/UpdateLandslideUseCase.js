import { LandslideRepository } from '../../../infrastructure/database/repositories/LandslideRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES, LANDSLIDE_TYPES } from '../../../shared/constants/roles.js';

export class UpdateLandslideUseCase {
  constructor() {
    this.landslideRepository = new LandslideRepository();
  }

  async execute(id, landslideData, userRole = null, userDistrict = null, userProvince = null) {
    // Check if exists
    const existing = await this.landslideRepository.findById(id);
    if (!existing) {
      throw new AppError('Landslide point not found', 404);
    }

    // Nếu là Officer, chỉ cho phép sửa các điểm trong xã của họ
    if (userRole === ROLES.OFFICER && existing.district !== userDistrict) {
      throw new AppError('Bạn chỉ có quyền quản lý các điểm sạt lở trong xã/phường của mình', 403);
    }

    // Validate level if provided
    if (landslideData.level !== undefined && (landslideData.level < 1 || landslideData.level > 5)) {
      throw new AppError('Level must be between 1 and 5', 400);
    }

    // Validate type if provided
    if (landslideData.type !== undefined) {
      const allowedTypes = Object.values(LANDSLIDE_TYPES);
      if (!allowedTypes.includes(landslideData.type)) {
        throw new AppError('Invalid landslide type', 400);
      }
    }

    // Officer không được thay đổi phạm vi
    if (userRole === ROLES.OFFICER) {
      if (landslideData.province && userProvince && landslideData.province !== userProvince) {
        throw new AppError('Officer không được thay đổi tỉnh/thành phố', 403);
      }
      if (landslideData.district && userDistrict && landslideData.district !== userDistrict) {
        throw new AppError('Officer không được thay đổi xã/phường', 403);
      }
      // đảm bảo vẫn giữ nguyên province/district đúng phạm vi
      landslideData.province = existing.province;
      landslideData.district = existing.district;
    }

    // Update
    const updated = await this.landslideRepository.update(id, landslideData);
    return updated;
  }
}

