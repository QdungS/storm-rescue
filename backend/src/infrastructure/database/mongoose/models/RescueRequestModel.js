import mongoose from 'mongoose';

const rescueRequestSchema = new mongoose.Schema({
  contactName: { type: String, required: true, trim: true },
  contactPhone: { type: String, required: true, trim: true },
  contactEmail: { type: String, trim: true },
  rescueCode: { type: String, unique: true, sparse: true, trim: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  demographics: {
    children: { type: Number, default: 0 },
    women: { type: Number, default: 0 },
    elderly: { type: Number, default: 0 }
  },
  trappedCount: { type: Number, default: 0 },
  priority: {
    type: String,
    enum: ['Bình thường', 'Khẩn cấp', 'Rất khẩn cấp'],
    default: 'Bình thường'
  },
  previousContact: {
    contactName: { type: String, trim: true },
    time: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  spamReports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isDuplicate: { type: Boolean, default: false },
  description: { type: String, trim: true },
  status: {
    type: String,
    enum: ['Chờ tiếp nhận', 'Đang xử lý', 'Đã giải quyết', 'Từ chối'],
    default: 'Chờ tiếp nhận'
  },
  notes: { type: String, trim: true },
  province: { type: String, trim: true },
  district: { type: String, trim: true },
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  coordinatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  processingAt: { type: Date },
  rescuedAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

rescueRequestSchema.index({ lat: 1, lng: 1 });

export const RescueRequestModel = mongoose.model('RescueRequest', rescueRequestSchema);
