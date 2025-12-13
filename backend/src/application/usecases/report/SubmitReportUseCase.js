import { ReportRepository } from '../../../infrastructure/database/repositories/ReportRepository.js';
import { AppError } from '../../../shared/errors/AppError.js';

export class SubmitReportUseCase {
  constructor() {
    this.reportRepository = new ReportRepository();
  }

  async execute(reportData) {
    const { senderId, title, description, location, latitude, longitude, images } = reportData;

    if (!title || !description || latitude === undefined || longitude === undefined) {
      throw new AppError('Missing required fields', 400);
    }

    const report = await this.reportRepository.create({
      sender: senderId,
      title,
      description,
      location,
      latitude,
      longitude,
      images: images || []
    });

    return report;
  }
}

