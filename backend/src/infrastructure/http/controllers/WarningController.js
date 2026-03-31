import { CreateWarningUseCase } from '../../../application/usecases/warning/CreateWarningUseCase.js';
import { GetWarningsUseCase } from '../../../application/usecases/warning/GetWarningsUseCase.js';
import { UpdateWarningUseCase } from '../../../application/usecases/warning/UpdateWarningUseCase.js';
import { DeleteWarningUseCase } from '../../../application/usecases/warning/DeleteWarningUseCase.js';
import { successResponse } from '../../../shared/utils/response.js';

export class WarningController {
  async create(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        data.province = req.user.province ? req.user.province.trim() : null;
      }
      const createUseCase = new CreateWarningUseCase();
      const warning = await createUseCase.execute(data);
      return successResponse(res, warning, 'Warning created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const query = { ...req.query };

      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        delete query.province;
        const userProv = req.user.province ? req.user.province.trim() : null;
        query.$or = [
          { province: userProv },
          { province: { $in: [null, ""] } }
        ];
      }

      const getUseCase = new GetWarningsUseCase();
      const warnings = await getUseCase.execute(query);
      return successResponse(res, warnings, 'Warnings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        data.province = req.user.province ? req.user.province.trim() : null;
      }
      const updateUseCase = new UpdateWarningUseCase();
      const warning = await updateUseCase.execute(req.params.id, data);
      return successResponse(res, warning, 'Warning updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleteUseCase = new DeleteWarningUseCase();
      await deleteUseCase.execute(req.params.id);
      return successResponse(res, null, 'Warning deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
