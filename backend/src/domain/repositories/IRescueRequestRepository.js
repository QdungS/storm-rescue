export class IRescueRequestRepository {
  async create(rescueData) {
    throw new Error('Method create() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async update(id, rescueData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async findDuplicate(lat, lng, contactPhone) {
    throw new Error('Method findDuplicate() must be implemented');
  }
}
