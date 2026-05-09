import { ManageSafetyGuideUseCase } from '../../../application/usecases/safety/ManageSafetyGuideUseCase.js';
import { ManageSafeZoneUseCase } from '../../../application/usecases/safety/ManageSafeZoneUseCase.js';
import { ManageEmergencyContactUseCase } from '../../../application/usecases/safety/ManageEmergencyContactUseCase.js';
import { successResponse } from '../../../shared/utils/response.js';

export class SafetyController {

  async createGuide(req, res, next) {
    try {
      const useCase = new ManageSafetyGuideUseCase();
      const guide = await useCase.create(req.body);
      return successResponse(res, guide, 'Safety guide created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getGuides(req, res, next) {
    try {
      const useCase = new ManageSafetyGuideUseCase();
      const guides = await useCase.getAll(req.query || {});
      return successResponse(res, guides, 'Safety guides retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateGuide(req, res, next) {
    try {
      const useCase = new ManageSafetyGuideUseCase();
      const guide = await useCase.update(req.params.id, req.body);
      return successResponse(res, guide, 'Safety guide updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteGuide(req, res, next) {
    try {
      const useCase = new ManageSafetyGuideUseCase();
      await useCase.delete(req.params.id);
      return successResponse(res, null, 'Safety guide deleted successfully');
    } catch (error) {
      next(error);
    }
  }

async createSafeZone(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        data.province = req.user.province ? req.user.province.trim() : null;
      }
      const useCase = new ManageSafeZoneUseCase();
      const zone = await useCase.create(data);
      return successResponse(res, zone, 'Safe zone created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getSafeZones(req, res, next) {
    try {
      const query = { ...(req.query || {}) };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        query.province = req.user.province ? req.user.province.trim() : null;
      }
      const useCase = new ManageSafeZoneUseCase();
      const zones = await useCase.getAll(query);
      return successResponse(res, zones, 'Safe zones retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateSafeZone(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        data.province = req.user.province ? req.user.province.trim() : null;
      }
      const useCase = new ManageSafeZoneUseCase();
      const zone = await useCase.update(req.params.id, data);
      return successResponse(res, zone, 'Safe zone updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteSafeZone(req, res, next) {
    try {
      const useCase = new ManageSafeZoneUseCase();
      await useCase.delete(req.params.id);
      return successResponse(res, null, 'Safe zone deleted successfully');
    } catch (error) {
      next(error);
    }
  }

async createContact(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        data.province = req.user.province ? req.user.province.trim() : null;
      }
      const useCase = new ManageEmergencyContactUseCase();
      const contact = await useCase.create(data);
      return successResponse(res, contact, 'Emergency contact created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async getContacts(req, res, next) {
    try {
      const query = { ...(req.query || {}) };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        query.province = req.user.province ? req.user.province.trim() : null;
      }
      const useCase = new ManageEmergencyContactUseCase();
      const contacts = await useCase.getAll(query);
      return successResponse(res, contacts, 'Emergency contacts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateContact(req, res, next) {
    try {
      const data = { ...req.body };
      if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
        data.province = req.user.province ? req.user.province.trim() : null;
      }
      const useCase = new ManageEmergencyContactUseCase();
      const contact = await useCase.update(req.params.id, data);
      return successResponse(res, contact, 'Emergency contact updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const useCase = new ManageEmergencyContactUseCase();
      await useCase.delete(req.params.id);
      return successResponse(res, null, 'Emergency contact deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
