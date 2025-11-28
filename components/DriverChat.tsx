import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MapPin } from 'lucide-react';
import { ParkingSpot, ChatMessage } from '../types';
import { getDriverAssistance } from '../services/geminiService';

interface DriverChatProps {
  spots: ParkingSpot[];
}

const DriverChat: React.FC<DriverChatProps> = ({ spots }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I can help you find a parking spot quickly to save fuel and time. Where would you like to park?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getDriverAssistance(input, spots);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-indigo-50 flex items-center gap-2">
        <Bot className="text-indigo-600" size={20} />
        <div>
          <h3 className="font-semibold text-slate-800">Smart Assistant</h3>
          <p className="text-xs text-slate-500">Finds spots & optimized routes</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-100 text-slate-800 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-100 p-3 rounded-lg rounded-bl-none text-slate-500 text-sm flex gap-1">
               <span className="animate-bounce">●</span>
               <span className="animate-bounce delay-100">●</span>
               <span className="animate-bounce delay-200">●</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g., Find me a handicap spot..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setInput("Where is the nearest spot?")} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 whitespace-nowrap">Nearest Spot</button>
            <button onClick={() => setInput("Any EV spots available?")} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 whitespace-nowrap">EV Spots</button>
            <button onClick={() => setInput("What are the parking rates?")} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 whitespace-nowrap">Rates</button>
        </div>
      </div>
    </div>
  );
};

export default DriverChat;
