export class ISafetyRepository {
  // Safety Guides
  async createGuide(guideData) {
    throw new Error('Method createGuide() must be implemented');
  }

  async findGuideById(id) {
    throw new Error('Method findGuideById() must be implemented');
  }

  async findAllGuides() {
    throw new Error('Method findAllGuides() must be implemented');
  }

  async updateGuide(id, guideData) {
    throw new Error('Method updateGuide() must be implemented');
  }

  async deleteGuide(id) {
    throw new Error('Method deleteGuide() must be implemented');
  }

  // Safe Zones
  async createSafeZone(zoneData) {
    throw new Error('Method createSafeZone() must be implemented');
  }

  async findSafeZoneById(id) {
    throw new Error('Method findSafeZoneById() must be implemented');
  }

  async findAllSafeZones() {
    throw new Error('Method findAllSafeZones() must be implemented');
  }

  async updateSafeZone(id, zoneData) {
    throw new Error('Method updateSafeZone() must be implemented');
  }

  async deleteSafeZone(id) {
    throw new Error('Method deleteSafeZone() must be implemented');
  }

  // Emergency Contacts
  async createContact(contactData) {
    throw new Error('Method createContact() must be implemented');
  }

  async findContactById(id) {
    throw new Error('Method findContactById() must be implemented');
  }

  async findAllContacts() {
    throw new Error('Method findAllContacts() must be implemented');
  }

  async updateContact(id, contactData) {
    throw new Error('Method updateContact() must be implemented');
  }

  async deleteContact(id) {
    throw new Error('Method deleteContact() must be implemented');
  }
}

