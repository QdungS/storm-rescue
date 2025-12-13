import express from 'express';
import { LandslideController } from '../controllers/LandslideController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../../../shared/constants/roles.js';

const router = express.Router();
const landslideController = new LandslideController();

// Public route with optional authentication (to filter by province for Officers)
router.get('/', optionalAuthenticate, landslideController.getAll.bind(landslideController));

// Protected routes
router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  landslideController.create.bind(landslideController));
router.put('/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  landslideController.update.bind(landslideController));
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), 
  landslideController.delete.bind(landslideController));

export default router;

