import express from 'express';
import { SafetyController } from '../controllers/SafetyController.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../../../shared/constants/roles.js';

const router = express.Router();
const safetyController = new SafetyController();

// Safety Guides - Public read, Admin write
router.get('/guides', safetyController.getGuides.bind(safetyController));
router.post('/guides', authenticate, authorize(ROLES.ADMIN), 
  safetyController.createGuide.bind(safetyController));
router.put('/guides/:id', authenticate, authorize(ROLES.ADMIN), 
  safetyController.updateGuide.bind(safetyController));
router.delete('/guides/:id', authenticate, authorize(ROLES.ADMIN), 
  safetyController.deleteGuide.bind(safetyController));

// Safe Zones - Public read with optional auth (to filter by province for Officers), Admin and Officer write
router.get('/safe-zones', optionalAuthenticate, safetyController.getSafeZones.bind(safetyController));
router.post('/safe-zones', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  safetyController.createSafeZone.bind(safetyController));
router.put('/safe-zones/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  safetyController.updateSafeZone.bind(safetyController));
router.delete('/safe-zones/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  safetyController.deleteSafeZone.bind(safetyController));

// Emergency Contacts - Public read with optional auth (to filter by province for Officers), Admin and Officer write
router.get('/contacts', optionalAuthenticate, safetyController.getContacts.bind(safetyController));
router.post('/contacts', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  safetyController.createContact.bind(safetyController));
router.put('/contacts/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  safetyController.updateContact.bind(safetyController));
router.delete('/contacts/:id', authenticate, authorize(ROLES.ADMIN, ROLES.OFFICER), 
  safetyController.deleteContact.bind(safetyController));

export default router;

