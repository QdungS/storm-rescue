import mongoose from 'mongoose';
import { WARNING_LEVEL } from '../../../../shared/constants/roles.js';

const warningSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  level: { type: String, enum: Object.values(WARNING_LEVEL), default: WARNING_LEVEL.WARNING },
  location: { type: String, trim: true },
  province: { type: String, required: true, trim: true },
  district: { type: String, trim: true }
}, {
  timestamps: true
});

export const WarningModel = mongoose.model('Warning', warningSchema);
