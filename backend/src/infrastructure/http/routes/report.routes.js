import express from 'express';
import { ReportController } from '../controllers/ReportController.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import { ROLES } from '../../../shared/constants/roles.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const router = express.Router();
const reportController = new ReportController();

// Citizen routes
router.post('/', authenticate, authorize(ROLES.CITIZEN), 
  upload.array('images', 3), 
  reportController.submit.bind(reportController));
router.get('/my', authenticate, authorize(ROLES.CITIZEN), 
  reportController.getMyReports.bind(reportController));

// Officer/Admin routes
router.get('/', authenticate, authorize(ROLES.OFFICER, ROLES.ADMIN), 
  reportController.getAll.bind(reportController));
router.put('/:id/status', authenticate, authorize(ROLES.OFFICER, ROLES.ADMIN), 
  reportController.updateStatus.bind(reportController));

export default router;

