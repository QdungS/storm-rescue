import { WarningRepository } from '../../../infrastructure/database/repositories/WarningRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class CreateWarningUseCase {
  constructor() {
    this.warningRepository = new WarningRepository();
  }

  async execute(warningData, userRole = null, userDistrict = null, userProvince = null) {
    const { title, content, level, location, province, district } = warningData;

    if (!title || !content) {
      throw new AppError('Title and content are required', 400);
    }

    // Nếu là Officer, tự động gán district và province của họ
    let finalProvince = province;
    let finalDistrict = district;
    if (userRole === ROLES.OFFICER) {
      finalProvince = userProvince;
      finalDistrict = userDistrict;
    }

    const warning = await this.warningRepository.create({
      title,
      content,
      level: level || 'warning',
      location,
      province: finalProvince,
      district: finalDistrict
    });

    return warning;
  }
}

