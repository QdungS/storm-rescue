import { SubmitReportUseCase } from '../../../application/usecases/report/SubmitReportUseCase.js';
import { GetMyReportsUseCase } from '../../../application/usecases/report/GetMyReportsUseCase.js';
import { UpdateReportStatusUseCase } from '../../../application/usecases/report/UpdateReportStatusUseCase.js';
import { ReportRepository } from '../../database/repositories/ReportRepository.js';
import { successResponse } from '../../../shared/utils/response.js';

export class ReportController {
  async submit(req, res, next) {
    try {
      const submitUseCase = new SubmitReportUseCase();
      const report = await submitUseCase.execute({
        ...req.body,
        senderId: req.user.id,
        images: req.files ? req.files.map(f => `/uploads/${f.filename}`) : []
      });
      return successResponse(res, report, 'Report submitted successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getMyReports(req, res, next) {
    try {
      const getUseCase = new GetMyReportsUseCase();
      const reports = await getUseCase.execute(req.user.id);
      return successResponse(res, reports, 'Reports retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const reportRepository = new ReportRepository();
      const { ROLES } = await import('../../../shared/constants/roles.js');
      
      // Nếu là Officer, chỉ hiển thị các báo cáo từ người dân trong tỉnh của họ
      let filters = {};
      if (req.user?.role === ROLES.OFFICER && req.user?.province) {
        // Filter reports by sender's province
        // We need to find users in the same province first, then filter reports by those users
        const { UserRepository } = await import('../../database/repositories/UserRepository.js');
        const { UserModel } = await import('../../database/mongoose/models/UserModel.js');
        const usersInProvince = await UserModel.find({ province: req.user.province }).select('_id');
        const userIds = usersInProvince.map(u => u._id);
        filters = { sender: { $in: userIds } };
      }
      
      const reports = await reportRepository.findAll(filters);
      return successResponse(res, reports, 'All reports retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const updateUseCase = new UpdateReportStatusUseCase();
      const report = await updateUseCase.execute(
        req.params.id,
        req.body.status,
        req.body.feedback
      );
      return successResponse(res, report, 'Report status updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

