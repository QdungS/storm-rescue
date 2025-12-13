import { ReportModel } from '../mongoose/models/ReportModel.js';
import { Report } from '../../../domain/entities/Report.js';
import { IReportRepository } from '../../../domain/repositories/IReportRepository.js';

export class ReportRepository extends IReportRepository {
  async create(reportData) {
    const report = await ReportModel.create(reportData);
    await report.populate('sender', 'name email');
    return this._toEntity(report);
  }

  async findById(id) {
    const report = await ReportModel.findById(id).populate('sender', 'name email');
    return report ? this._toEntity(report) : null;
  }

  async findBySender(senderId) {
    const reports = await ReportModel.find({ sender: senderId })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });
    return reports.map(report => this._toEntity(report));
  }

  async findAll(filters = {}) {
    const reports = await ReportModel.find(filters)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });
    return reports.map(report => this._toEntity(report));
  }

  async update(id, reportData) {
    const report = await ReportModel.findByIdAndUpdate(id, reportData, { new: true, runValidators: true })
      .populate('sender', 'name email');
    return report ? this._toEntity(report) : null;
  }

  async delete(id) {
    await ReportModel.findByIdAndDelete(id);
    return true;
  }

  _toEntity(reportDoc) {
    return new Report({
      id: reportDoc._id.toString(),
      sender: reportDoc.sender,
      title: reportDoc.title,
      description: reportDoc.description,
      location: reportDoc.location,
      latitude: reportDoc.latitude,
      longitude: reportDoc.longitude,
      images: reportDoc.images || [],
      status: reportDoc.status,
      feedback: reportDoc.feedback,
      createdAt: reportDoc.createdAt,
      updatedAt: reportDoc.updatedAt,
      completedAt: reportDoc.completedAt
    });
  }
}

