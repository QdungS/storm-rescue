import { CreateWarningUseCase } from '../../../application/usecases/warning/CreateWarningUseCase.js';
import { GetWarningsUseCase } from '../../../application/usecases/warning/GetWarningsUseCase.js';
import { UpdateWarningUseCase } from '../../../application/usecases/warning/UpdateWarningUseCase.js';
import { DeleteWarningUseCase } from '../../../application/usecases/warning/DeleteWarningUseCase.js';
import { successResponse } from '../../../shared/utils/response.js';

export class WarningController {
  async create(req, res, next) {
    try {
      const createUseCase = new CreateWarningUseCase();
      const warning = await createUseCase.execute(
        req.body,
        req.user?.role,
        req.user?.district,
        req.user?.province
      );
      return successResponse(res, warning, 'Warning created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const getUseCase = new GetWarningsUseCase();
      const warnings = await getUseCase.execute(
        req.query,
        req.user?.role,
        req.user?.district,
        req.user?.province
      );
      return successResponse(res, warnings, 'Warnings retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updateUseCase = new UpdateWarningUseCase();
      const warning = await updateUseCase.execute(
        req.params.id,
        req.body,
        req.user?.role,
        req.user?.district,
        req.user?.province
      );
      return successResponse(res, warning, 'Warning updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleteUseCase = new DeleteWarningUseCase();
      await deleteUseCase.execute(
        req.params.id,
        req.user?.role,
        req.user?.district
      );
      return successResponse(res, null, 'Warning deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

