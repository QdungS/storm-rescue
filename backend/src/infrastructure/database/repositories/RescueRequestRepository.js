import { RescueRequestModel } from '../mongoose/models/RescueRequestModel.js';
import { RescueRequest } from '../../../domain/entities/RescueRequest.js';
import { IRescueRequestRepository } from '../../../domain/repositories/IRescueRequestRepository.js';

export class RescueRequestRepository extends IRescueRequestRepository {
  async create(rescueData) {
    const request = await RescueRequestModel.create(rescueData);
    return this._toEntity(request);
  }

  async findById(id) {
    const request = await RescueRequestModel.findById(id);
    return request ? this._toEntity(request) : null;
  }

  async findByCode(code) {
    const request = await RescueRequestModel.findOne({ rescueCode: code });
    return request ? this._toEntity(request) : null;
  }

  async findAll(filters = {}) {
    const requests = await RescueRequestModel.find(filters).sort({ updatedAt: -1 });
    return requests.map(req => this._toEntity(req));
  }

  async update(id, rescueData) {
    const request = await RescueRequestModel.findByIdAndUpdate(
      id,
      { ...rescueData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    return request ? this._toEntity(request) : null;
  }

  async delete(id) {
    await RescueRequestModel.findByIdAndDelete(id);
    return true;
  }

  async findDuplicate(lat, lng, contactPhone, contactEmail) {
    const threshold = 0.001;
    const filter = {
      status: { $ne: 'Đã được cứu' },
      $or: [
        { contactPhone: contactPhone }
      ]
    };

    if (contactEmail) {
      filter.$or.push({ contactEmail: contactEmail });
    }

    filter.$or.push({
      lat: { $gte: lat - threshold, $lte: lat + threshold },
      lng: { $gte: lng - threshold, $lte: lng + threshold }
    });

    return await RescueRequestModel.findOne(filter);
  }

  _toEntity(reqDoc) {
    return new RescueRequest({
      id: reqDoc._id.toString(),
      contactName: reqDoc.contactName,
      contactPhone: reqDoc.contactPhone,
      contactEmail: reqDoc.contactEmail,
      rescueCode: reqDoc.rescueCode,
      lat: reqDoc.lat,
      lng: reqDoc.lng,
      demographics: reqDoc.demographics,
      trappedCount: reqDoc.trappedCount,
      priority: reqDoc.priority,
      previousContact: reqDoc.previousContact,
      spamReports: reqDoc.spamReports,
      description: reqDoc.description,
      status: reqDoc.status,
      notes: reqDoc.notes,
      province: reqDoc.province,
      district: reqDoc.district,
      source: reqDoc.source,
      isDuplicate: reqDoc.isDuplicate,
      assignedTo: reqDoc.assignedTo,
      coordinatedBy: reqDoc.coordinatedBy,
      citizenId: reqDoc.citizenId,
      processingAt: reqDoc.processingAt,
      rescuedAt: reqDoc.rescuedAt,
      updatedAt: reqDoc.updatedAt,
      createdAt: reqDoc.createdAt
    });
  }
}
