import { RescueRequestRepository } from '../../../infrastructure/database/repositories/RescueRequestRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class GetRescueRequestByCodeUseCase {
  constructor() {
    this.rescueRepository = new RescueRequestRepository();
  }

  async execute(code) {
    if (!code) {
      throw new AppError('Mã cứu hộ không được để trống', 400);
    }

    const request = await this.rescueRepository.findByCode(code.toUpperCase());

    if (!request) {
      throw new AppError('Không tìm thấy yêu cầu với mã cứu hộ này', 404);
    }

    return request;
  }
}
