import { CreateUserUseCase } from '../../../application/usecases/user/CreateUserUseCase.js';
import { GetUsersUseCase } from '../../../application/usecases/user/GetUsersUseCase.js';
import { UpdateUserUseCase } from '../../../application/usecases/user/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../../../application/usecases/user/DeleteUserUseCase.js';
import { ToggleUserLockUseCase } from '../../../application/usecases/user/ToggleUserLockUseCase.js';

import { successResponse } from '../../../shared/utils/response.js';

export class UserController {
  async create(req, res, next) {
    try {
      const createUseCase = new CreateUserUseCase();
      const user = await createUseCase.execute(req.body);
      return successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const query = { ...req.query };

if (req.user && req.user.role === 'coordinator') {
        query.province = req.user.province;
      }

      const getUseCase = new GetUsersUseCase();
      const users = await getUseCase.execute(query);
      return successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const updateUseCase = new UpdateUserUseCase();
      const user = await updateUseCase.execute(req.params.id, req.body);
      return successResponse(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deleteUseCase = new DeleteUserUseCase();
      await deleteUseCase.execute(req.params.id);
      return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async toggleLock(req, res, next) {
    try {
      const toggleUseCase = new ToggleUserLockUseCase();
      const user = await toggleUseCase.execute(req.params.id);
      return successResponse(res, user, 'User lock status updated successfully');
    } catch (error) {
      next(error);
    }
  }


}
