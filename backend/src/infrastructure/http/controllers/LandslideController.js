import { CreateLandslideUseCase } from '../../../application/usecases/landslide/CreateLandslideUseCase.js';
import { GetLandslidesUseCase } from '../../../application/usecases/landslide/GetLandslidesUseCase.js';
import { UpdateLandslideUseCase } from '../../../application/usecases/landslide/UpdateLandslideUseCase.js';
import { DeleteLandslideUseCase } from '../../../application/usecases/landslide/DeleteLandslideUseCase.js';
import { successResponse } from '../../../shared/utils/response.js';

export class LandslideController {
  async create(req, res, next) {
    try {
      const createUseCase = new CreateLandslideUseCase();
      const landslide = await createUseCase.execute(
        req.body,
        req.user?.role,
        req.user?.district,
        req.user?.province
      );
      return successResponse(res, landslide, 'Landslide point created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const getUseCase = new GetLandslidesUseCase();
      const landslides = await getUseCase.execute(
        req.query,
        req.user?.role,
        req.user?.district,
        req.user?.province
      );
      return successResponse(res, landslides, 'Landslides retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updateUseCase = new UpdateLandslideUseCase();
      const landslide = await updateUseCase.execute(
        req.params.id,
        req.body,
        req.user?.role,
        req.user?.district,
        req.user?.province
      );
      return successResponse(res, landslide, 'Landslide point updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleteUseCase = new DeleteLandslideUseCase();
      await deleteUseCase.execute(
        req.params.id,
        req.user?.role,
        req.user?.district
      );
      return successResponse(res, null, 'Landslide point deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

