
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, MoreHorizontal, Paperclip } from 'lucide-react';

interface Props {
  recipientName: string;
  listingTitle?: string;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: Date;
}

const MessageModal: React.FC<Props> = ({ recipientName, listingTitle, onClose }) => {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: `Hi, I'm interested in ${listingTitle || 'your property'}. Is it still available for my dates?`, sender: 'me', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', text: 'Yes, it is! When are you looking to move in?', sender: 'them', timestamp: new Date(Date.now() - 80000000) }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    
    const newMsg: Message = {
      id: Math.random().toString(),
      text: messageText,
      sender: 'me',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMsg]);
    setMessageText('');

    // Simulate reply
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Math.random().toString(),
            text: "Thanks for the update. Let me know if you need anything else.",
            sender: 'them',
            timestamp: new Date()
        }]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col animate-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 relative">
                    <User size={20} />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <div className="font-bold text-slate-900 text-sm">{recipientName}</div>
                    {listingTitle && <div className="text-xs text-slate-500 truncate max-w-[180px]">{listingTitle}</div>}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><MoreHorizontal size={20} /></button>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"><X size={20} /></button>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.sender === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                        {msg.text}
                        <div className={`text-[10px] mt-1 text-right ${msg.sender === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-full px-4 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
                <input 
                    type="text" 
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="text-slate-400 hover:text-slate-600">
                    <Paperclip size={18} />
                </button>
                <button 
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={14} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
