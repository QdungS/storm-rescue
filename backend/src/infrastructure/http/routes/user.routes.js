import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../../../shared/constants/roles.js';

const router = express.Router();
const userController = new UserController();



router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.COORDINATOR),
  userController.getAll.bind(userController));
router.post('/', authenticate, authorize(ROLES.ADMIN),
  userController.create.bind(userController));
router.put('/:id', authenticate, authorize(ROLES.ADMIN),
  userController.update.bind(userController));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN),
  userController.delete.bind(userController));
router.put('/:id/toggle-lock', authenticate, authorize(ROLES.ADMIN),
  userController.toggleLock.bind(userController));

export default router;
