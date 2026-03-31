import express from 'express';
import {
  createRescueRequest,
  getRescueRequests,
  getRescueRequestByCode,
  updateRescueRequest,
  deleteRescueRequest,
  acceptRescueRequest,
  reportFakeRescueRequest
} from '../controllers/RescueRequestController.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', optionalAuthenticate, getRescueRequests);

router.get('/code/:code', optionalAuthenticate, getRescueRequestByCode);

router.post('/', optionalAuthenticate, createRescueRequest);

router.put('/:id', authenticate, authorize('citizen', 'officer', 'coordinator'), updateRescueRequest);

router.delete('/:id', authenticate, authorize('coordinator', 'officer'), deleteRescueRequest);

router.post('/:id/accept-task', authenticate, authorize('officer', 'coordinator'), acceptRescueRequest);

router.post('/:id/report-fake', authenticate, authorize('officer', 'coordinator'), reportFakeRescueRequest);

export default router;
