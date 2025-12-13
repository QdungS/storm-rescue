import express from 'express';
import { WarningController } from '../controllers/WarningController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../../../shared/constants/roles.js';

const router = express.Router();
const warningController = new WarningController();

// Public route with optional authentication (to filter by province for Officers)
router.get('/', optionalAuthenticate, warningController.getAll.bind(warningController));

// Protected routes
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  warningController.create.bind(warningController));
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  warningController.update.bind(warningController));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  warningController.delete.bind(warningController));

export default router;

