import mongoose from 'mongoose';

const safeZoneSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  province: { type: String, trim: true },
  district: { type: String, trim: true },
  capacity: { type: String, trim: true },
  status: { type: String, default: 'Sẵn sàng' },
  lat: { type: Number },
  lng: { type: Number }
}, {
  timestamps: true
});

export const SafeZoneModel = mongoose.model('SafeZone', safeZoneSchema);
