import { RescueRequestRepository } from '../../database/repositories/RescueRequestRepository.js';
import mongoose from 'mongoose';
import { RescueRequestModel } from '../../database/mongoose/models/RescueRequestModel.js';
import { UserModel } from '../../database/mongoose/models/UserModel.js';
import { CreateRescueRequestUseCase } from '../../../application/usecases/rescue/CreateRescueRequestUseCase.js';
import { GetRescueRequestsUseCase } from '../../../application/usecases/rescue/GetRescueRequestsUseCase.js';
import { GetRescueRequestByCodeUseCase } from '../../../application/usecases/rescue/GetRescueRequestByCodeUseCase.js';
import { UpdateRescueRequestUseCase } from '../../../application/usecases/rescue/UpdateRescueRequestUseCase.js';
import { DeleteRescueRequestUseCase } from '../../../application/usecases/rescue/DeleteRescueRequestUseCase.js';
import { successResponse } from '../../../shared/utils/response.js';

const repository = new RescueRequestRepository();
const createUseCase = new CreateRescueRequestUseCase(repository);
const getUseCase = new GetRescueRequestsUseCase(repository);
const getByCodeUseCase = new GetRescueRequestByCodeUseCase();
const updateUseCase = new UpdateRescueRequestUseCase(repository);
const deleteUseCase = new DeleteRescueRequestUseCase(repository);

export const createRescueRequest = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      citizenId: req.user?.id
    };
    const request = await createUseCase.execute(data);
    return successResponse(res, request, 'Rescue request created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getRescueRequests = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.province) filters.province = req.query.province;
    if (req.query.district) filters.district = req.query.district;
    if (req.query.status) filters.status = req.query.status;

    if (req.user && req.user.role === 'citizen' && req.query.isMine === 'true') {
      filters.citizenId = req.user.id;
    }

    if (req.user && (req.user.role === 'coordinator' || req.user.role === 'officer')) {
      filters.province = req.user.province;
    }

    const requests = await getUseCase.execute(filters);
    return successResponse(res, requests, 'Rescue requests retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRescueRequestByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const request = await getByCodeUseCase.execute(code);
    return successResponse(res, request, 'Rescue request retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateRescueRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userRole = req.user?.role;
    const userDistrict = req.user?.district;
    const userProvince = req.user?.province;

    if (data.assignedTo) {
      data.coordinatedBy = req.user?.id;
    }

    const request = await updateUseCase.execute(id, data, userRole, userDistrict, userProvince);
    return successResponse(res, request, 'Rescue request updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteRescueRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteUseCase.execute(id);
    return successResponse(res, null, 'Rescue request deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const acceptRescueRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await updateUseCase.execute(id, { status: 'Đang xử lý', assignedTo: req.user?.id });
    return successResponse(res, request, 'Rescue request accepted successfully');
  } catch (error) {
    next(error);
  }
};

export const reportFakeRescueRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await RescueRequestModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const userId = req.user.id;
    if (!request.spamReports.includes(userId)) {
      request.spamReports.push(userId);
      await request.save();

      if (request.spamReports.length >= 3) {
        request.status = 'Từ chối';
        await request.save();

        if (request.citizenId) {
          const user = await UserModel.findById(request.citizenId);
          if (user) {
            user.fakeReportCount = (user.fakeReportCount || 0) + 1;
            if (user.fakeReportCount >= 3) {
              user.status = 'locked';
            }
            await user.save();
          }
        }
      }
    }
    return successResponse(res, request, 'Reported fake request successfully');
  } catch (error) {
    next(error);
  }
};

/* Extract ward/commune name from a free-text address.
   e.g. "29 Hoàng Ngân, Phường Túc Duyên" → "Phường Túc Duyên"
        "Số 21, Đường sắt, Phường Quang Vinh" → "Phường Quang Vinh"        */
const extractWard = (address) => {
  if (!address) return 'Không xác định';
  const match = address.match(/(?:phường|xã|thị trấn|thị xã|quận|huyện)\s+[^,]+/i);
  if (match) return match[0].trim();
  return 'Không rõ phường/xã';
};

export const getStatsByProvince = async (req, res, next) => {
  try {
    const allRequests = await RescueRequestModel.find({}).lean();

    const provinceMap = {};

    for (const r of allRequests) {
      const prov = r.province || 'Không xác định';
      const ward = extractWard(r.district);   // ← group by ward, not raw address

      if (!provinceMap[prov]) {
        provinceMap[prov] = {
          province: prov,
          total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0,
          rescuedChildren: 0, rescuedWomen: 0, rescuedElderly: 0, rescuedOthers: 0,
          districts: {}
        };
      }
      const p = provinceMap[prov];
      p.total++;

      if (!p.districts[ward]) {
        p.districts[ward] = {
          district: ward,
          total: 0, pending: 0, inProgress: 0, resolved: 0, rejected: 0,
          rescuedChildren: 0, rescuedWomen: 0, rescuedElderly: 0, rescuedOthers: 0
        };
      }
      const d = p.districts[ward];
      d.total++;

      if (r.status === 'Chờ tiếp nhận')    { p.pending++;    d.pending++;    }
      else if (r.status === 'Đang xử lý')  { p.inProgress++; d.inProgress++; }
      else if (r.status === 'Đã giải quyết') {
        p.resolved++; d.resolved++;
        const children = r.demographics?.children || 0;
        const women    = r.demographics?.women    || 0;
        const elderly  = r.demographics?.elderly  || 0;
        const trapped  = r.trappedCount           || 0;
        const others   = Math.max(0, trapped - children - women - elderly);
        p.rescuedChildren += children; d.rescuedChildren += children;
        p.rescuedWomen    += women;    d.rescuedWomen    += women;
        p.rescuedElderly  += elderly;  d.rescuedElderly  += elderly;
        p.rescuedOthers   += others;   d.rescuedOthers   += others;
      } else if (r.status === 'Từ chối')   { p.rejected++;   d.rejected++;   }
    }

    const stats = Object.values(provinceMap).map(prov => ({
      ...prov,
      districts: Object.values(prov.districts).sort((a, b) => b.total - a.total)
    })).sort((a, b) => b.total - a.total);

    return res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
