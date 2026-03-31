import { RescueRequestRepository } from '../../../infrastructure/database/repositories/RescueRequestRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';
import { mailService } from '../../../infrastructure/services/MailService.js';

export class UpdateRescueRequestUseCase {
  constructor() {
    this.rescueRepository = new RescueRequestRepository();
  }

  async execute(id, rescueData, userRole = null, userDistrict = null, userProvince = null) {

    const existing = await this.rescueRepository.findById(id);
    if (!existing) {
      throw new AppError('Không tìm thấy điểm cứu hộ', 404);
    }

const statusChanged = rescueData.status && rescueData.status !== existing.status;
    if (statusChanged) {
      if (rescueData.status === 'Đang xử lý') rescueData.processingAt = new Date();
      if (rescueData.status === 'Đã được cứu') rescueData.rescuedAt = new Date();
    }

const request = await this.rescueRepository.update(id, rescueData);

if (statusChanged) {
      const email = request.contactEmail || existing.contactEmail;
      const code = request.rescueCode || existing.rescueCode;

      if (email && (rescueData.status === 'Đang xử lý' || rescueData.status === 'Đã được cứu')) {
        try {
          await mailService.sendStatusUpdateEmail(email, code, rescueData.status);
        } catch (e) {
          console.error('Không thể tự động gửi mail cập nhật tiến độ:', e);
        }
      }
    }

    return request;
  }
}
