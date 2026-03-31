import { SafetyGuideModel } from '../mongoose/models/SafetyGuideModel.js';
import { SafeZoneModel } from '../mongoose/models/SafeZoneModel.js';
import { EmergencyContactModel } from '../mongoose/models/EmergencyContactModel.js';
import { ISafetyRepository } from '../../../domain/repositories/ISafetyRepository.js';

export class SafetyRepository extends ISafetyRepository {

  async createGuide(guideData) {
    const guide = await SafetyGuideModel.create(guideData);
    return this._guideToObject(guide);
  }

  async findGuideById(id) {
    const guide = await SafetyGuideModel.findById(id);
    return guide ? this._guideToObject(guide) : null;
  }

  async findAllGuides(filters = {}) {
    const guides = await SafetyGuideModel.find(filters).sort({ updatedAt: -1 });
    return guides.map(guide => this._guideToObject(guide));
  }

  async updateGuide(id, guideData) {
    const guide = await SafetyGuideModel.findByIdAndUpdate(id, guideData, { new: true, runValidators: true });
    return guide ? this._guideToObject(guide) : null;
  }

  async deleteGuide(id) {
    await SafetyGuideModel.findByIdAndDelete(id);
    return true;
  }

async createSafeZone(zoneData) {
    const zone = await SafeZoneModel.create(zoneData);
    return this._zoneToObject(zone);
  }

  async findSafeZoneById(id) {
    const zone = await SafeZoneModel.findById(id);
    return zone ? this._zoneToObject(zone) : null;
  }

  async findAllSafeZones(filters = {}) {
    const zones = await SafeZoneModel.find(filters);
    return zones.map(zone => this._zoneToObject(zone));
  }

  async updateSafeZone(id, zoneData) {
    const zone = await SafeZoneModel.findByIdAndUpdate(id, zoneData, { new: true, runValidators: true });
    return zone ? this._zoneToObject(zone) : null;
  }

  async deleteSafeZone(id) {
    await SafeZoneModel.findByIdAndDelete(id);
    return true;
  }

async createContact(contactData) {
    const contact = await EmergencyContactModel.create(contactData);
    return this._contactToObject(contact);
  }

  async findContactById(id) {
    const contact = await EmergencyContactModel.findById(id);
    return contact ? this._contactToObject(contact) : null;
  }

  async findAllContacts(filters = {}) {
    const contacts = await EmergencyContactModel.find(filters);
    return contacts.map(contact => this._contactToObject(contact));
  }

  async updateContact(id, contactData) {
    const contact = await EmergencyContactModel.findByIdAndUpdate(id, contactData, { new: true, runValidators: true });
    return contact ? this._contactToObject(contact) : null;
  }

  async deleteContact(id) {
    await EmergencyContactModel.findByIdAndDelete(id);
    return true;
  }

  _guideToObject(guideDoc) {
    return {
      id: guideDoc._id.toString(),
      title: guideDoc.title,
      category: guideDoc.category,
      content: guideDoc.content,
      updatedAt: guideDoc.updatedAt,
      createdAt: guideDoc.createdAt
    };
  }

  _zoneToObject(zoneDoc) {
    return {
      id: zoneDoc._id.toString(),
      name: zoneDoc.name,
      address: zoneDoc.address,
      province: zoneDoc.province,
      district: zoneDoc.district,
      capacity: zoneDoc.capacity,
      status: zoneDoc.status,
      lat: zoneDoc.lat,
      lng: zoneDoc.lng,
      createdAt: zoneDoc.createdAt,
      updatedAt: zoneDoc.updatedAt
    };
  }

  _contactToObject(contactDoc) {
    return {
      id: contactDoc._id.toString(),
      name: contactDoc.name,
      phone: contactDoc.phone,
      province: contactDoc.province,
      district: contactDoc.district,
      createdAt: contactDoc.createdAt,
      updatedAt: contactDoc.updatedAt
    };
  }
}
