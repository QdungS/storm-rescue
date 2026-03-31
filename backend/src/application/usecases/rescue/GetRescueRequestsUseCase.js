import { RescueRequestRepository } from '../../../infrastructure/database/repositories/RescueRequestRepository.js';
import { ROLES } from '../../../shared/constants/roles.js';

export class GetRescueRequestsUseCase {
  constructor() {
    this.rescueRepository = new RescueRequestRepository();
  }

  async execute(query = {}, userRole = null, userDistrict = null, userProvince = null) {
    const filters = {};

if (query.province) filters.province = query.province;
    if (query.district) filters.district = query.district;
    if (query.status) filters.status = query.status;
    if (query.priority) filters.priority = query.priority;
    if (query.floodLevel) filters.floodLevel = query.floodLevel;
    if (query.citizenId) filters.citizenId = query.citizenId;

if (userRole === ROLES.OFFICER) {

      if (userProvince) filters.province = userProvince;
      if (userDistrict) filters.district = userDistrict;
    }

    const requests = await this.rescueRepository.findAll(filters);
    return requests;
  }
}
