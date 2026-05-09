export class RescueRequest {
  constructor({ id, contactName, contactPhone, contactEmail, rescueCode, lat, lng, demographics, trappedCount, priority, previousContact, spamReports, description, status, notes, province, district, isDuplicate, assignedTo, coordinatedBy, citizenId, processingAt, rescuedAt, updatedAt, createdAt }) {
    this.id = id;
    this.contactName = contactName;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
    this.rescueCode = rescueCode;
    this.lat = lat;
    this.lng = lng;
    this.demographics = demographics;
    this.trappedCount = trappedCount;
    this.priority = priority;
    this.previousContact = previousContact;
    this.spamReports = spamReports;
    this.description = description;
    this.status = status;
    this.notes = notes;
    this.province = province;
    this.district = district;
    this.isDuplicate = isDuplicate || false;
    this.assignedTo = assignedTo;
    this.coordinatedBy = coordinatedBy;
    this.citizenId = citizenId;
    this.processingAt = processingAt;
    this.rescuedAt = rescuedAt;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}
