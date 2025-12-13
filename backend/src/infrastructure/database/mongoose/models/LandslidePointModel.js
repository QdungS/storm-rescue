import mongoose from 'mongoose';

const landslidePointSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  level: { type: Number, required: true, min: 1, max: 5 },
  type: {
    type: String,
    enum: [
      'Sạt lở đất',
      'Sạt lở đá',
      'Lũ quét',
      'Sạt lở ven sông',
      'Sụt lún/Hố sụt',
      'Trượt taluy đường',
      'Dòng bùn đá'
    ]
  },
  description: { type: String, trim: true },
  status: { type: String, default: 'Đang theo dõi' },
  province: { type: String, trim: true }, // Tỉnh
  district: { type: String, trim: true }, // Xã/Phường - để giới hạn quyền Officer
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for geolocation queries
landslidePointSchema.index({ lat: 1, lng: 1 });

export const LandslidePointModel = mongoose.model('LandslidePoint', landslidePointSchema);

