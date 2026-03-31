export class Warning {
  constructor({ id, title, content, level, location, province, district, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.level = level;
    this.location = location;
    this.province = province;
    this.district = district;
    this.createdAt = createdAt;
  }
}
