export class Report {
  constructor({ id, sender, title, description, location, latitude, longitude, images, status, feedback, createdAt, updatedAt, completedAt }) {
    this.id = id;
    this.sender = sender;
    this.title = title;
    this.description = description;
    this.location = location;
    this.latitude = latitude;
    this.longitude = longitude;
    this.images = images || [];
    this.status = status;
    this.feedback = feedback;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.completedAt = completedAt;
  }
}

