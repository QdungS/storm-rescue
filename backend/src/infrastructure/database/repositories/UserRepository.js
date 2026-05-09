import { UserModel } from '../mongoose/models/UserModel.js';
import { User } from '../../../domain/entities/User.js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';

export class UserRepository extends IUserRepository {
  async create(userData) {
    const user = await UserModel.create(userData);
    return this._toEntity(user);
  }

  async findById(id) {
    const user = await UserModel.findById(id);
    return user ? this._toEntity(user) : null;
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ email });
    return user ? this._toEntity(user) : null;
  }

  async findAll(filters = {}) {
    const users = await UserModel.find(filters);
    return users.map(user => this._toEntity(user));
  }

  async update(id, userData) {
    const user = await UserModel.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
    return user ? this._toEntity(user) : null;
  }

  async delete(id) {
    await UserModel.findByIdAndDelete(id);
    return true;
  }

  _toEntity(userDoc) {
    return new User({
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      password: userDoc.password,
      province: userDoc.province,
      district: userDoc.district,
      phone: userDoc.phone,
      role: userDoc.role,
      status: userDoc.status,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt
    });
  }
}
