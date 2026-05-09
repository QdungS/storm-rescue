import { RescueRequestRepository } from '../../../infrastructure/database/repositories/RescueRequestRepository.js';
import { mailService } from '../../../infrastructure/services/MailService.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { ROLES } from '../../../shared/constants/roles.js';
import crypto from 'crypto';

export class CreateRescueRequestUseCase {
  constructor() {
    this.rescueRepository = new RescueRequestRepository();
  }

  generateRescueCode() {
    return 'RS' + crypto.randomBytes(2).toString('hex').toUpperCase();
  }

  async execute(rescueData, userRole = null, userDistrict = null, userProvince = null) {
    const { contactName, contactPhone, contactEmail, lat, lng, demographics, previousContact, description, status, notes, province, district, citizenId } = rescueData;

    if (!contactName || !contactPhone || !contactEmail || lat === undefined || lng === undefined) {
      throw new AppError('Thiếu các trường bắt buộc (Tên, SĐT, Email, Tọa độ)', 400);
    }

if (!province || !district) {
      throw new AppError('Yêu cầu cung cấp tỉnh và huyện', 400);
    }

const existing = await this.rescueRepository.findDuplicate(lat, lng, contactPhone, contactEmail);
    const isDuplicate = !!existing;

let finalProvince = province;
    let finalDistrict = district;

    if (userRole === ROLES.OFFICER) {
      if (!userProvince || !userDistrict) {
        throw new AppError('Tài khoản Officer thiếu thông tin tỉnh/huyện', 400);
      }
      if (province && province !== userProvince) {
        throw new AppError('Officer chỉ được thêm điểm trong tỉnh/thành phố của mình', 403);
      }

      if (district && district !== userDistrict) {
        throw new AppError('Officer chỉ được thêm điểm trong Địa chỉ của mình', 403);
      }
      finalProvince = userProvince;
      finalDistrict = userDistrict;
    }

    const rescueCode = this.generateRescueCode();

    const request = await this.rescueRepository.create({
      contactName,
      contactPhone,
      contactEmail,
      rescueCode,
      lat,
      lng,
      demographics: demographics || {},
      trappedCount: rescueData.trappedCount || 0,
      priority: rescueData.priority || 'Bình thường',
      previousContact: previousContact || {},
      description,
      status: status || 'Chờ tiếp nhận',
      notes,
      province: finalProvince,
      district: finalDistrict,
      isDuplicate,
      citizenId: citizenId || null
    });

    try {
      if (contactEmail) {
        await mailService.sendRescueCodeEmail(contactEmail, rescueCode);
      }
    } catch (e) {
      console.error('Không thể gửi mail kèm Mã cứu hộ:', e);
    }

    return request;
  }
}
