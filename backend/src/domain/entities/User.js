export class User {
  constructor({ id, name, email, password, cccd, province, district, phone, role, status, savedLocations, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.cccd = cccd;
    this.province = province;
    this.district = district;
    this.phone = phone;
    this.role = role;
    this.status = status;
    this.savedLocations = savedLocations || [];
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
