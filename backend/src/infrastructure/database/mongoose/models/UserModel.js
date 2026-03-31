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
  cccd: { type: String, unique: true, sparse: true, trim: true },
  province: { type: String, trim: true },
  district: { type: String, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.CITIZEN },
  status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
  fakeReportCount: { type: Number, default: 0 },
  resetPasswordCode: { type: String, trim: true },
  resetPasswordExpires: { type: Date },
  savedLocations: [savedLocationSchema]
}, {
  timestamps: true
});

userSchema.index({ email: 1 });
userSchema.index({ cccd: 1 });

export const UserModel = mongoose.model('User', userSchema);
