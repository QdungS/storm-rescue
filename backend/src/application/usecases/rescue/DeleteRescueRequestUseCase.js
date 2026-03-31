import { RescueRequestRepository } from '../../../infrastructure/database/repositories/RescueRequestRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class DeleteRescueRequestUseCase {
  constructor() {
    this.rescueRepository = new RescueRequestRepository();
  }

  async execute(id, userRole = null, userDistrict = null, userProvince = null) {
    const existing = await this.rescueRepository.findById(id);
    if (!existing) {
      throw new AppError('Không tìm thấy điểm cứu hộ', 404);
    }

if (userRole === ROLES.OFFICER) {
      if (existing.province !== userProvince || existing.district !== userDistrict) {
        throw new AppError('Officer không có quyền xóa điểm cứu hộ ngoài khu vực quản lý', 403);
      }
    } else if (userRole === ROLES.CITIZEN) {
        throw new AppError('Citizen không có quyền xóa điểm cứu hộ', 403);
    }

    await this.rescueRepository.delete(id);
    return true;
  }
}
