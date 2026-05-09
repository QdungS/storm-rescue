import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from 'antd';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  AlertTriangle,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là Trợ lý Cứu hộ AI 24/7. Tôi có thể giúp gì cho bạn? Hãy hỏi tôi về khu vực an toàn, số điện thoại khẩn cấp, hoặc cách gửi yêu cầu cứu hộ.',
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    { label: 'Gửi cứu hộ khẩn cấp', icon: <AlertTriangle size={14} />, route: '/report' },
    { label: 'Tìm nơi an toàn', icon: <ShieldCheck size={14} />, route: '/safety' },
    { label: 'Số điện thoại hỗ trợ', icon: <PhoneCall size={14} />, route: '/safety' },
    { label: 'Liên hệ Ban Quản Trị', icon: <Settings size={14} />, action: 'chat' },
  ];

  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // Gửi lịch sử hội thoại để AI nhớ ngữ cảnh (bỏ tin nhắn chào mừng đầu tiên)
      const history = updatedMessages.slice(1, -1).map(msg => ({
        sender: msg.sender,
        text: msg.text,
      }));

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      const data = await response.json();

      if (!response.ok) {
        const friendlyMsg = response.status === 429
          ? 'Trợ lý đang bận, vui lòng đợi vài giây rồi thử lại nhé!'
          : 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.';
        throw new Error(friendlyMsg);
      }

      const aiText = data?.data?.reply || 'Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.';

      const aiMsg = {
        id: Date.now() + 1,
        text: aiText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat API error:', error);
      // Hiển thị message cụ thể nếu có (ví dụ: rate limit), ngược lại hiện lỗi mạng
      const displayText = error?.message && !error.message.includes('fetch')
        ? error.message
        : 'Kết nối gián đoạn. Vui lòng kiểm tra kết nối mạng và thử lại, hoặc gọi ngay 112 nếu khẩn cấp.';
      const errorMsg = {
        id: Date.now() + 1,
        text: displayText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
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
                  <Sparkles size={10} className="text-yellow-300" /> AI
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
                placeholder="Hỏi AI về thông tin bão, nơi an toàn, cứu hộ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={() => handleSend(inputValue)}
                disabled={isTyping}
                className="rounded-2xl bg-slate-100 border-none focus:bg-white h-12 px-5 text-sm"
              />
              <Button
                type="primary"
                icon={<Send size={20} />}
                onClick={() => handleSend(inputValue)}
                loading={isTyping}
                disabled={isTyping}
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
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white shadow-sm items-center justify-center text-[10px] font-bold flex">1</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
