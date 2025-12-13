export class LandslidePoint {
  constructor({ id, name, lat, lng, level, type, description, status, province, district, updatedAt, createdAt }) {
    this.id = id;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.level = level;
    this.type = type;
    this.description = description;
    this.status = status;
    this.province = province;
    this.district = district;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
  }
}

