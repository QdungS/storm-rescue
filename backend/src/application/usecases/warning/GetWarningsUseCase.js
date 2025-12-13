import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class GetWarningsUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(filters = {}, userRole = null, userDistrict = null, userProvince = null) {
    // Nếu là Officer, chỉ hiển thị các cảnh báo trong tỉnh của họ
    if (userRole === ROLES.OFFICER && userProvince) {
      filters.province = userProvince;
    }
    return await this.warningRepository.findAll(filters);
  }
}

