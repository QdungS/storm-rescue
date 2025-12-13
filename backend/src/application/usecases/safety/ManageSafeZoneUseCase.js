import { SafetyRepository } from '../../../infrastructure/database/repositories/SafetyRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class ManageSafeZoneUseCase {
  constructor() {
    this.safetyRepository = new SafetyRepository();
  }

  async create(zoneData, userRole = null, userProvince = null) {
    if (!zoneData.name || !zoneData.address) {
      throw new AppError('Name and address are required', 400);
    }

    // Nếu là Officer, tự động gán province của họ và validate
    if (userRole === ROLES.OFFICER) {
      if (!userProvince) {
        throw new AppError('Officer account missing assigned province', 400);
      }
      if (zoneData.province && zoneData.province !== userProvince) {
        throw new AppError('Bạn chỉ có thể thêm khu vực an toàn trong tỉnh/thành phố của mình', 403);
      }
      zoneData.province = userProvince;
    }

    return await this.safetyRepository.createSafeZone(zoneData);
  }

  async getAll(filters = {}, userRole = null, userProvince = null) {
    // Nếu là Officer, chỉ hiển thị các khu vực an toàn trong tỉnh của họ
    if (userRole === ROLES.OFFICER && userProvince) {
      filters.province = userProvince;
    }
    return await this.safetyRepository.findAllSafeZones(filters);
  }

  async update(id, zoneData, userRole = null, userProvince = null) {
    const zone = await this.safetyRepository.findSafeZoneById(id);
    if (!zone) {
      throw new AppError('Safe zone not found', 404);
    }

    // Nếu là Officer, chỉ cho phép sửa trong phạm vi tỉnh của mình
    if (userRole === ROLES.OFFICER) {
      if (!userProvince) {
        throw new AppError('Officer account missing assigned province', 400);
      }
      if (zone.province !== userProvince) {
        throw new AppError('Bạn chỉ có quyền sửa các khu vực an toàn trong tỉnh/thành phố của mình', 403);
      }
      // Không cho phép Officer thay đổi province
      if (zoneData.province && zoneData.province !== userProvince) {
        throw new AppError('Bạn không thể thay đổi tỉnh/thành phố của khu vực an toàn', 403);
      }
      zoneData.province = userProvince;
    }

    return await this.safetyRepository.updateSafeZone(id, zoneData);
  }

  async delete(id, userRole = null, userProvince = null) {
    const zone = await this.safetyRepository.findSafeZoneById(id);
    if (!zone) {
      throw new AppError('Safe zone not found', 404);
    }

    // Nếu là Officer, chỉ cho phép xóa trong phạm vi tỉnh của mình
    if (userRole === ROLES.OFFICER) {
      if (!userProvince) {
        throw new AppError('Officer account missing assigned province', 400);
      }
      if (zone.province !== userProvince) {
        throw new AppError('Bạn chỉ có quyền xóa các khu vực an toàn trong tỉnh/thành phố của mình', 403);
      }
    }

    await this.safetyRepository.deleteSafeZone(id);
    return true;
  }
}

