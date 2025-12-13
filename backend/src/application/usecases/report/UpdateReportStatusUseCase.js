import { ReportRepository } from '../../../infrastructure/database/repositories/ReportRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { REPORT_STATUS } from '../../../shared/constants/roles.js';

export class UpdateReportStatusUseCase {
  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async execute(reportId, status, feedback) {
    const report = await this.reportRepository.findById(reportId);
    
    if (!report) {
      throw new AppError('Report not found', 404);
    }

    const updateData = {
      status,
      feedback
    };

    // Nếu status là "Hoàn tất", lưu thời gian hoàn tất
    if (status === REPORT_STATUS.COMPLETED) {
      updateData.completedAt = new Date();
    }

    const updated = await this.reportRepository.update(reportId, updateData);

    return updated;
  }
}

