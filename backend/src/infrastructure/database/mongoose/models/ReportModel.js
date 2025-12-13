import mongoose from 'mongoose';
import { REPORT_STATUS } from '../../../../shared/constants/roles.js';

const reportSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, trim: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  images: [{ type: String }], // URLs to uploaded images
  status: { type: String, enum: Object.values(REPORT_STATUS), default: REPORT_STATUS.PENDING },
  feedback: { type: String, trim: true },
  completedAt: { type: Date } // Thời gian hoàn tất
}, {
  timestamps: true
});

// Index for sender and status
reportSchema.index({ sender: 1 });
reportSchema.index({ status: 1 });

export const ReportModel = mongoose.model('Report', reportSchema);

