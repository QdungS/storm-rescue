import mongoose from 'mongoose';
import { WARNING_LEVEL } from '../../../../shared/constants/roles.js';

const warningSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  level: { type: String, enum: Object.values(WARNING_LEVEL), default: WARNING_LEVEL.WARNING },
  location: { type: String, trim: true },
  province: { type: String, trim: true }, // Tỉnh
  district: { type: String, trim: true } // Xã/Phường - để giới hạn quyền Officer
}, {
  timestamps: true
});

export const WarningModel = mongoose.model('Warning', warningSchema);

