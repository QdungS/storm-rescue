import { LandslideRepository } from '../../../infrastructure/database/repositories/LandslideRepository.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class GetLandslidesUseCase {
  constructor() {
    this.landslideRepository = new LandslideRepository();
  }

  async execute(filters = {}, userRole = null, userDistrict = null, userProvince = null) {
    // Officer có thể xem tất cả các điểm sạt lở, filter sẽ được thực hiện ở frontend
    // Nếu có filter province được truyền từ query params, sử dụng filter đó
    // (không tự động gán province của Officer vào filters)
    return await this.landslideRepository.findAll(filters);
  }
}

