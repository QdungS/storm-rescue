import mongoose from 'mongoose';

const safetyGuideSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

export const SafetyGuideModel = mongoose.model('SafetyGuide', safetyGuideSchema);

