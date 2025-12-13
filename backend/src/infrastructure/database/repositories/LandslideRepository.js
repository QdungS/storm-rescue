import { LandslidePointModel } from '../mongoose/models/LandslidePointModel.js';
import { LandslidePoint } from '../../../domain/entities/LandslidePoint.js';
import { ILandslideRepository } from '../../../domain/repositories/ILandslideRepository.js';

export class LandslideRepository extends ILandslideRepository {
  async create(landslideData) {
    const landslide = await LandslidePointModel.create(landslideData);
    return this._toEntity(landslide);
  }

  async findById(id) {
    const landslide = await LandslidePointModel.findById(id);
    return landslide ? this._toEntity(landslide) : null;
  }

  async findAll(filters = {}) {
    const landslides = await LandslidePointModel.find(filters).sort({ updatedAt: -1 });
    return landslides.map(landslide => this._toEntity(landslide));
  }

  async update(id, landslideData) {
    const landslide = await LandslidePointModel.findByIdAndUpdate(
      id,
      { ...landslideData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return landslide ? this._toEntity(landslide) : null;
  }

  async delete(id) {
    await LandslidePointModel.findByIdAndDelete(id);
    return true;
  }

  _toEntity(landslideDoc) {
    return new LandslidePoint({
      id: landslideDoc._id.toString(),
      name: landslideDoc.name,
      lat: landslideDoc.lat,
      lng: landslideDoc.lng,
      level: landslideDoc.level,
      type: landslideDoc.type,
      description: landslideDoc.description,
      status: landslideDoc.status,
      province: landslideDoc.province,
      district: landslideDoc.district,
      updatedAt: landslideDoc.updatedAt,
      createdAt: landslideDoc.createdAt
    });
  }
}

