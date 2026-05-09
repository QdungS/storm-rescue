import { ManageSafeZoneUseCase } from '../../../application/usecases/safety/ManageSafeZoneUseCase.js';
import { ManageEmergencyContactUseCase } from '../../../application/usecases/safety/ManageEmergencyContactUseCase.js';
import { successResponse } from '../../../shared/utils/response.js';

const buildSystemPrompt = (safeZones, contacts) => {
  let contextData = '';

  if (safeZones && safeZones.length > 0) {
    contextData += '\n\n## DỮ LIỆU KHU VỰC AN TOÀN TRONG HỆ THỐNG:\n';
    safeZones.forEach(z => {
      contextData += `- ${z.name} | Địa chỉ: ${z.address} | Tỉnh: ${z.province} | Trạng thái: ${z.status || 'Đang hoạt động'}\n`;
    });
  }

  if (contacts && contacts.length > 0) {
    contextData += '\n## SỐ ĐIỆN THOẠI KHẨN CẤP TRONG HỆ THỐNG:\n';
    contacts.forEach(c => {
      contextData += `- ${c.name}: ${c.phone} | Tỉnh: ${c.province}\n`;
    });
  }

  return `Bạn là Trợ lý Cứu hộ thông minh 24/7 của hệ thống Storm Rescue .

## NHIỆM VỤ:
- Hỗ trợ người dân trong tình huống bão 
- Cung cấp thông tin khu vực an toàn và số điện thoại khẩn cấp dựa trên dữ liệu thực của hệ thống (xem bên dưới)
- Hướng dẫn gửi yêu cầu cứu hộ: bảo người dùng truy cập trang /report hoặc nhấn nút "GỬI YÊU CẦU CỨU HỘ" trên menu
- Tư vấn an toàn khi gặp bão (cách sơ tán, đồ cần mang theo, v.v.)
- Thông tin Ban Quản Trị: Email: quangdung24092004@gmail.com | Facebook: https://www.facebook.com/qdv2gogh/
- Số hotline quốc gia khẩn cấp: 112 (cứu hộ tổng hợp), 113 (công an), 114 (cứu hỏa), 115 (cấp cứu)

## QUY TẮC:
- LUÔN trả lời bằng tiếng Việt, ngắn gọn, rõ ràng, dễ hiểu
- Ưu tiên dữ liệu thực của hệ thống khi người dùng hỏi về khu vực an toàn hoặc SĐT khẩn cấp
- Nếu không có dữ liệu cho tỉnh đó, hướng dẫn gọi 112 hoặc liên hệ chính quyền địa phương
- Từ chối lịch sự nếu người dùng hỏi ngoài chủ đề thiên tai/cứu hộ/an toàn
- Không cần dùng markdown phức tạp, chỉ dùng dấu • để liệt kê nếu cần
- Giữ câu trả lời dưới 200 từ trừ khi câu hỏi yêu cầu danh sách dài
${contextData}`;
};

export class ChatController {
  async chat(req, res, next) {
    try {
      const { message, history = [] } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message is required' });
      }

      // Lấy dữ liệu thực từ DB để inject vào context AI
      let safeZones = [];
      let contacts = [];
      try {
        const zoneUseCase = new ManageSafeZoneUseCase();
        const contactUseCase = new ManageEmergencyContactUseCase();
        [safeZones, contacts] = await Promise.all([
          zoneUseCase.getAll({}),
          contactUseCase.getAll({})
        ]);
      } catch (dbErr) {
        console.warn('ChatController: Could not fetch safety data from DB:', dbErr.message);
      }

      const systemPrompt = buildSystemPrompt(safeZones, contacts);

      // Chuyển đổi history sang format OpenAI-compatible (Groq)
      const groqHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      const messages = [
        { role: 'system', content: systemPrompt },
        ...groqHistory,
        { role: 'user', content: message },
      ];

      // Gọi Groq API (OpenAI-compatible)
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!groqResponse.ok) {
        const errBody = await groqResponse.json().catch(() => ({}));
        const errMsg = errBody?.error?.message || `Groq API error: ${groqResponse.status}`;
        console.error('Groq API error:', errMsg);

        if (groqResponse.status === 429) {
          return res.status(429).json({
            success: false,
            message: 'Hệ thống đang bận, vui lòng thử lại sau vài giây.'
          });
        }
        return res.status(500).json({ success: false, message: 'Lỗi hệ thống AI. Vui lòng thử lại.' });
      }

      const data = await groqResponse.json();
      const aiText = data?.choices?.[0]?.message?.content || 'Xin lỗi, tôi gặp sự cố. Vui lòng thử lại.';

      return successResponse(res, { reply: aiText }, 'Chat response generated');
    } catch (error) {
      const errMsg = error?.message || String(error);
      console.error('ChatController error:', errMsg);
      return res.status(500).json({ success: false, message: 'Lỗi hệ thống AI. Vui lòng thử lại.' });
    }
  }
}
