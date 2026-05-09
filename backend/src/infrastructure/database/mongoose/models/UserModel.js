import mongoose from 'mongoose';
import { ROLES, USER_STATUS } from '../../../../shared/constants/roles.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  province: { type: String, trim: true },
  district: { type: String, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: Object.values(ROLES), default: ROLES.CITIZEN },
  status: { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
  fakeReportCount: { type: Number, default: 0 },
  resetPasswordCode: { type: String, trim: true },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

export const UserModel = mongoose.model('User', userSchema);
