import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      });
      console.log('Email sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendResetCode(email, code) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <h2 style="color: #1e3a8a; text-align: center;">Khôi phục mật khẩu</h2>
        <p>Chào bạn,</p>
        <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu khôi phục mật khẩu cho tài khoản trên hệ thống <strong>Storm Rescue</strong>.</p>
        <p>Vui lòng sử dụng mã xác nhận dưới đây để đổi mật khẩu của bạn:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1d4ed8;">${code}</span>
        </div>
        <p>Mã này có hiệu lực trong <strong>15 phút</strong>. Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Hệ thống Cứu hộ Bão  —  Thăng Long University
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `[Storm Rescue] Mã xác nhận khôi phục mật khẩu: ${code}`,
      html,
    });
  }

  async sendRescueCodeEmail(email, code) {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <h2 style="color: #1e3a8a; text-align: center;">Yêu cầu cứu hộ đã được ghi nhận</h2>
        <p>Chào bạn,</p>
        <p>Hệ thống <strong>Storm Rescue</strong> đã ghi nhận yêu cầu cứu hộ khẩn cấp của bạn.</p>
        <p>Để theo dõi tiến độ xử lý và cập nhật thông tin cứu hộ, bạn có thể tra cứu bằng Mã Cứu Hộ bên dưới:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #dc2626;">${code}</span>
        </div>
        <p>Nhân viên điều phối hoặc lực lượng cứu hộ sẽ liên lạc với bạn qua số điện thoại sớm nhất có thể.</p>
        <p>Hãy cố gắng giữ an toàn và giữ liên lạc!</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Hệ thống Cứu hộ Bão  —  Thăng Long University
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `[Storm Rescue] Mã theo dõi yêu cầu cứu hộ: ${code}`,
      html,
    });
  }

  async sendStatusUpdateEmail(email, code, status) {
    let title = '';
    let message = '';
    let color = '';

    if (status === 'Đang xử lý') {
      title = 'Đội cứu hộ đang trên đường tới';
      message = 'Yêu cầu cứu hộ của bạn đã xác nhận và phân công cho Đội cứu hộ tiếp cận. Lực lượng cứu hộ đang trên đường đến vị trí của bạn.';
      color = '#2563eb';
    } else if (status === 'Đã được cứu') {
      title = 'Nhiệm vụ cứu hộ hoàn tất thành công';
      message = 'Hệ thống ghi nhận nhiệm vụ cứu hộ của bạn đã được báo cáo hoàn tất an toàn. Xin chúc bạn và mọi người luôn bình an!';
      color = '#16a34a';
    } else {
      return;
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
        <h2 style="color: ${color}; text-align: center;">${title}</h2>
        <p>Chào bạn,</p>
        <p>${message}</p>
        <p>Bạn có thể tiếp tục tra cứu thông tin chi tiết bằng <strong>Mã Cứu Hộ của bạn: <span style="color: #dc2626;">${code}</span></strong></p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">
          Hệ thống Cứu hộ Bão  —  Thăng Long University
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: `[Storm Rescue] Cập nhật tiến độ: ${title}`,
      html,
    });
  }
}

export const mailService = new MailService();
