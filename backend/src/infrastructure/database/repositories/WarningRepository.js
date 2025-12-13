import { WarningModel } from '../mongoose/models/WarningModel.js';
import { Warning } from '../../../domain/entities/Warning.js';
import { IWarningRepository } from '../../../domain/repositories/IWarningRepository.js';

export class WarningRepository extends IWarningRepository {
  async create(warningData) {
    const warning = await WarningModel.create(warningData);
    return this._toEntity(warning);
  }

  async findById(id) {
    const warning = await WarningModel.findById(id);
    return warning ? this._toEntity(warning) : null;
  }

  async findAll(filters = {}) {
    const warnings = await WarningModel.find(filters).sort({ createdAt: -1 });
    return warnings.map(warning => this._toEntity(warning));
  }

  async update(id, warningData) {
    const warning = await WarningModel.findByIdAndUpdate(id, warningData, { new: true, runValidators: true });
    return warning ? this._toEntity(warning) : null;
  }

  async delete(id) {
    await WarningModel.findByIdAndDelete(id);
    return true;
  }

  _toEntity(warningDoc) {
    return new Warning({
      id: warningDoc._id.toString(),
      title: warningDoc.title,
      content: warningDoc.content,
      level: warningDoc.level,
      location: warningDoc.location,
      province: warningDoc.province,
      district: warningDoc.district,
      createdAt: warningDoc.createdAt
    });
  }
}

