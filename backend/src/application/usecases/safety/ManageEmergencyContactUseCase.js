import { SafetyRepository } from '../../../infrastructure/database/repositories/SafetyRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class ManageEmergencyContactUseCase {
  constructor() {
    this.safetyRepository = new SafetyRepository();
  }

  async create(contactData, userRole = null, userProvince = null) {
    if (!contactData.name || !contactData.phone) {
      throw new AppError('Name and phone are required', 400);
    }

    // Nếu là Officer, tự động gán province của họ và validate
    if (userRole === ROLES.OFFICER) {
      if (!userProvince) {
        throw new AppError('Officer account missing assigned province', 400);
      }
      if (contactData.province && contactData.province !== userProvince) {
        throw new AppError('Bạn chỉ có thể thêm liên hệ khẩn cấp trong tỉnh/thành phố của mình', 403);
      }
      contactData.province = userProvince;
    }

    return await this.safetyRepository.createContact(contactData);
  }

  async getAll(filters = {}, userRole = null, userProvince = null) {
    // Nếu là Officer, chỉ hiển thị các liên hệ khẩn cấp trong tỉnh của họ
    if (userRole === ROLES.OFFICER && userProvince) {
      filters.province = userProvince;
    }
    return await this.safetyRepository.findAllContacts(filters);
  }

  async update(id, contactData, userRole = null, userProvince = null) {
    const contact = await this.safetyRepository.findContactById(id);
    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }

    // Nếu là Officer, chỉ cho phép sửa trong phạm vi tỉnh của mình
    if (userRole === ROLES.OFFICER) {
      if (!userProvince) {
        throw new AppError('Officer account missing assigned province', 400);
      }
      if (contact.province !== userProvince) {
        throw new AppError('Bạn chỉ có quyền sửa các liên hệ khẩn cấp trong tỉnh/thành phố của mình', 403);
      }
      // Không cho phép Officer thay đổi province
      if (contactData.province && contactData.province !== userProvince) {
        throw new AppError('Bạn không thể thay đổi tỉnh/thành phố của liên hệ khẩn cấp', 403);
      }
      contactData.province = userProvince;
    }

    return await this.safetyRepository.updateContact(id, contactData);
  }

  async delete(id, userRole = null, userProvince = null) {
    const contact = await this.safetyRepository.findContactById(id);
    if (!contact) {
      throw new AppError('Emergency contact not found', 404);
    }

    // Nếu là Officer, chỉ cho phép xóa trong phạm vi tỉnh của mình
    if (userRole === ROLES.OFFICER) {
      if (!userProvince) {
        throw new AppError('Officer account missing assigned province', 400);
      }
      if (contact.province !== userProvince) {
        throw new AppError('Bạn chỉ có quyền xóa các liên hệ khẩn cấp trong tỉnh/thành phố của mình', 403);
      }
    }

    await this.safetyRepository.deleteContact(id);
    return true;
  }
}

