import { ReportRepository } from '../../../infrastructure/database/repositories/ReportRepository.js';

export class GetMyReportsUseCase {
  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async execute(userId) {
    return await this.reportRepository.findBySender(userId);
  }
}

