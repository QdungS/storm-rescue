import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Avatar } from 'antd';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  Sparkles,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { safetyService } from '../services/safetyService';

const PROVINCES = [
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh',
  'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cần Thơ',
  'Cao Bằng', 'Đà Nẵng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
  'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh', 'Hải Dương', 'Hải Phòng', 'Hậu Giang',
  'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn',
  'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La',
  'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang',
  'TP Hồ Chí Minh', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái', 'Bình Giang'
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là Trợ lý Cứu hộ thông minh. Tôi có thể giúp gì cho bạn trong tình huống khẩn cấp này?",
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [safeZones, setSafeZones] = useState([]);
  const [contacts, setContacts] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zones, phones] = await Promise.all([
          safetyService.getSafeZones(),
          safetyService.getContacts()
        ]);
        setSafeZones(zones || []);
        setContacts(phones || []);
      } catch (error) {
        console.error('Chatbot failed to fetch safety data', error);
      }
    };
    fetchData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const removeAccents = (str) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  };

  const quickActions = [
    { label: 'Gửi cứu hộ khẩn cấp', icon: <AlertTriangle size={14} />, route: '/report' },
    { label: 'Tìm nơi an toàn', icon: <ShieldCheck size={14} />, route: '/safety' },
    { label: 'Số điện thoại hỗ trợ', icon: <PhoneCall size={14} />, route: '/safety' },
    { label: 'Liên hệ Ban Quản Trị', icon: <Settings size={14} />, route: '#' },
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = text.toLowerCase();
      const normalizedInput = removeAccents(lowerText);
      let aiText = "";

      const foundProvince = PROVINCES.find(p => {
        const normalizedProv = removeAccents(p.toLowerCase());
        return lowerText.includes(p.toLowerCase()) || normalizedInput.includes(normalizedProv);
      });

      if (lowerText.includes('admin') || lowerText.includes('quản trị') || lowerText.includes('hỗ trợ kỹ thuật')) {
        aiText = "Thông tin Ban Quản Trị Hệ Thống:\n\n Email: quangdung24092004@gmail.com \n Trang hỗ trợ: https://www.facebook.com/qdv2gogh/ \n\nChúng tôi luôn sẵn sàng hỗ trợ các vấn đề về tài khoản và vận hành hệ thống.";
      }
      else if (lowerText.includes('an toàn') || lowerText.includes('khu vực') || lowerText.includes('nơi ở') || normalizedInput.includes('an toan')) {
        if (foundProvince) {
          const matchedZones = safeZones.filter(z => z.province === foundProvince);
          if (matchedZones.length > 0) {
            aiText = `Tại ${foundProvince}, có các khu vực an toàn sau:\n` +
              matchedZones.map(z => `• ${z.name}: ${z.address} (${z.status})`).join('\n');
          } else {
            aiText = `Hiện tại hệ thống chưa cập nhật khu vực an toàn cụ thể tại ${foundProvince}. Bạn nên liên hệ chính quyền địa phương ngay lập tức.`;
          }
        } else {
          aiText = "Bạn đang ở tỉnh/thành phố nào? Hãy nhập tên tỉnh để tôi tìm khu vực an toàn gần bạn nhất (Ví dụ: 'Khu vực an toàn Hà Nội').";
        }
      }
      else if (lowerText.includes('điện thoại') || lowerText.includes('liên hệ') || lowerText.includes('sđt') || lowerText.includes('gọi') || normalizedInput.includes('dien thoai')) {
        if (foundProvince) {
          const matchedContacts = contacts.filter(c => c.province === foundProvince);
          if (matchedContacts.length > 0) {
            aiText = `Danh bạ khẩn cấp tại ${foundProvince}:\n` +
              matchedContacts.map(c => `• ${c.name}: ${c.phone}`).join('\n');
          } else {
            aiText = `Tôi không tìm thấy số điện thoại cứu hộ riêng cho ${foundProvince}. Bạn hãy liên hệ các hotline quốc gia như 112 nhé.`;
          }
        } else {
          aiText = "Bạn cần tìm số điện thoại của khu vực nào? (Ví dụ: 'SĐT khẩn cấp Hà Nội').";
        }
      }

      else if (foundProvince) {
        const matchedZones = safeZones.filter(z => z.province === foundProvince);
        const matchedContacts = contacts.filter(c => c.province === foundProvince);
        aiText = `Thông tin tại ${foundProvince}:\n\n`;
        if (matchedZones.length > 0) aiText += `Khu vực an toàn: ${matchedZones.length} địa điểm\n`;
        if (matchedContacts.length > 0) aiText += `SĐT khẩn cấp: ${matchedContacts.length} đầu số\n`;
        aiText += `\nBạn muốn xem chi tiết phần nào? (Ví dụ: "Xem khu vực an toàn ${foundProvince}")`;
      }

      else if (lowerText.includes('cứu hộ') || lowerText.includes('giúp')) {
        aiText = "Để gửi yêu cầu cứu hộ khẩn cấp, bạn hãy nhấn vào nút 'GỬI YÊU CẦU CỨU HỘ' màu đỏ ở menu trên cùng sau đó theo dõi tiến độ";
      } else if (lowerText.includes('chào') || lowerText.includes('hi')) {
        aiText = "Chào bạn! Tôi là Trợ lý Cứu hộ 24/7. Bạn cần hỗ trợ thông tin về bão, tìm nơi trú ẩn hay liên hệ khẩn cấp không?";
      } else {
        aiText = "Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể chọn các mục hỗ trợ nhanh bên dưới nhé.";
      }

      const aiMsg = {
        id: Date.now() + 1,
        text: aiText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleActionClick = (action) => {
    handleSend(action.label);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] font-sans text-slate-900">
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[580px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 relative">
                <Bot size={26} />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-indigo-600 rounded-full"></span>
              </div>
              <div>
                <div className="font-bold text-base tracking-wide">Trợ lý Cứu hộ 24/7</div>
                <div className="text-[11px] opacity-80 flex items-center gap-1 uppercase font-bold tracking-tighter">
                  <Sparkles size={10} className="text-yellow-300" /> Hệ thống sẵn sàng
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                    }`}>
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1.5 px-6">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-duration:0.6s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:0.6s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:0.6s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions & Input */}
          <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex overflow-x-auto gap-2 mb-5 pb-1 no-scrollbar">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleActionClick(action)}
                  className="px-4 py-2 bg-slate-50 hover:bg-blue-600 border border-slate-100 hover:border-blue-600 text-[12px] font-bold text-slate-600 hover:text-white rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                placeholder="Hỏi về khu vực an toàn, SĐT cứu hộ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={() => handleSend(inputValue)}
                className="rounded-2xl bg-slate-100 border-none focus:bg-white h-12 px-5 text-sm"
              />
              <Button
                type="primary"
                icon={<Send size={20} />}
                onClick={() => handleSend(inputValue)}
                className="h-12 w-12 rounded-2xl flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-18 h-18 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-[0_15px_35px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-95 group relative ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? <X size={42} /> : <MessageCircle size={42} className="group-hover:scale-110 transition-transform" />}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-5 w-5 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold">1</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
