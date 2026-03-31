export class IUserRepository {
  async create(userData) {
    throw new Error('Method create() must be implemented');
  }

  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  async findByEmail(email) {
    throw new Error('Method findByEmail() must be implemented');
  }

  async findByCCCD(cccd) {
    throw new Error('Method findByCCCD() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('Method findAll() must be implemented');
  }

  async update(id, userData) {
    throw new Error('Method update() must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }

  async addSavedLocation(userId, location) {
    throw new Error('Method addSavedLocation() must be implemented');
  }

  async removeSavedLocation(userId, locationId) {
    throw new Error('Method removeSavedLocation() must be implemented');
  }
}
