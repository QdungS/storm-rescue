import express from 'express';
import { WarningController } from '../controllers/WarningController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../../../shared/constants/roles.js';

const router = express.Router();
const warningController = new WarningController();

router.get('/', optionalAuthenticate, warningController.getAll.bind(warningController));

router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.COORDINATOR),
  warningController.create.bind(warningController));
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.COORDINATOR),
  warningController.update.bind(warningController));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER, ROLES.COORDINATOR),
  warningController.delete.bind(warningController));

export default router;
