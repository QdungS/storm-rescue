import { LandslideRepository } from '../../../infrastructure/database/repositories/LandslideRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES, LANDSLIDE_TYPES } from '../../../shared/constants/roles.js';

export class CreateLandslideUseCase {
  constructor() {
    this.landslideRepository = new LandslideRepository();
  }

  async execute(landslideData, userRole = null, userDistrict = null, userProvince = null) {
    const { name, lat, lng, level, type, description, status, province, district } = landslideData;

    // Validate required fields
    if (!name || lat === undefined || lng === undefined || !level) {
      throw new AppError('Missing required fields', 400);
    }

    // Validate level range
    if (level < 1 || level > 5) {
      throw new AppError('Level must be between 1 and 5', 400);
    }

    // Validate type
    const allowedTypes = Object.values(LANDSLIDE_TYPES);
    if (!type || !allowedTypes.includes(type)) {
      throw new AppError('Invalid landslide type', 400);
    }

    // Validate location
    if (!province || !district) {
      throw new AppError('Province and district are required', 400);
    }

    // Nếu là Officer, tự động gán district và province của họ
    let finalProvince = province;
    let finalDistrict = district;
    if (userRole === ROLES.OFFICER) {
      if (!userProvince || !userDistrict) {
        throw new AppError('Officer account missing assigned province/district', 400);
      }
      if (province && province !== userProvince) {
        throw new AppError('Officer chỉ được thêm điểm trong tỉnh/thành phố của mình', 403);
      }
      if (district && district !== userDistrict) {
        throw new AppError('Officer chỉ được thêm điểm trong xã/phường của mình', 403);
      }
      finalProvince = userProvince;
      finalDistrict = userDistrict;
    }

    // Create landslide point
    const landslide = await this.landslideRepository.create({
      name,
      lat,
      lng,
      level,
      type,
      description,
      status: status || 'Đang theo dõi',
      province: finalProvince,
      district: finalDistrict
    });

    return landslide;
  }
}

