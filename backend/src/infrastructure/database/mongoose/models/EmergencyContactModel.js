import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  province: { type: String, trim: true },
  district: { type: String, trim: true }
}, {
  timestamps: true
});

export const EmergencyContactModel = mongoose.model('EmergencyContact', emergencyContactSchema);
