import mongoose from 'mongoose';
import { ROLES, USER_STATUS, LOCATION_TYPE } from '../../../../shared/constants/roles.js';

const savedLocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(LOCATION_TYPE), default: LOCATION_TYPE.OTHER },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  cccd: { type: String, unique: true, sparse: true, trim: true }, // Căn cước công dân - unique, không bắt buộc nhưng nếu có thì phải unique
  province: { type: String, trim: true }, // Tỉnh
  district: { type: String, trim: true }, // Xã/Phường
  phone: { type: String, trim: true }, // Số điện thoại - không bắt buộc
  role: { type: String, enum: Object.values(ROLES), default: ROLES.CITIZEN },
  status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
  savedLocations: [savedLocationSchema]
}, {
  timestamps: true
});

// Index for email and cccd
userSchema.index({ email: 1 });
userSchema.index({ cccd: 1 });

export const UserModel = mongoose.model('User', userSchema);

