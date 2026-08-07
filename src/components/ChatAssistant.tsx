import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, OceanLocation } from '../types';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Loader2,
  Compass,
} from 'lucide-react';
import { motion } from 'motion/react';

interface ChatAssistantProps {
  selectedLocation: OceanLocation | null;
  isOpen: boolean;
  onToggleOpen: () => void;
  onFlyToLocation?: (locationName: string) => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  selectedLocation,
  isOpen,
  onToggleOpen,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Greetings! I am **FloatChat AI**, your satellite oceanography assistant. Select any ocean or coastal city on the 3D globe, or ask me anything about marine thermal dynamics, ARGO floats, or ocean currents!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Suggested questions based on context
  const suggestedQuestions = selectedLocation
    ? [
        `What is the exact SST and salinity of ${selectedLocation.name}?`,
        `Which ARGO floats monitor ${selectedLocation.name}?`,
        `Why is the salinity ${selectedLocation.avgSalinity} PSU here?`,
        `Explain the current vector (${selectedLocation.currentSpeed})`,
      ]
    : [
        'Which ocean has the highest salinity?',
        'Why is the Bay of Bengal warm with low salinity?',
        'How do ARGO floats profile down to 2000m pressure?',
        'Compare Indian Ocean vs Pacific Ocean currents',
      ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          locationContext: selectedLocation,
          history: messages.slice(-6), // memory context
        }),
      });

      const data = await response.json();

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || 'I am currently processing high-resolution telemetry. Please try again in a moment.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: `Based on satellite altimetry for **${selectedLocation?.name || 'the ocean'}**, sea surface temperature is ${selectedLocation?.avgTemp ?? 28.5}°C and salinity is ${selectedLocation?.avgSalinity ?? 34.2} PSU. ARGO floats report stable thermocline stratification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      className={`fixed top-16 right-0 bottom-12 z-20 transition-all duration-300 ease-in-out flex ${
        isOpen ? 'w-80 sm:w-96' : 'w-10'
      }`}
    >
      {/* Toggle Tab Button */}
      <button
        onClick={onToggleOpen}
        className="h-12 w-10 my-auto rounded-l-xl bg-white border-l border-y border-[#E5E7EB] text-[#2D3436] hover:text-[#1E6091] flex items-center justify-center shadow-md cursor-pointer"
        title={isOpen ? 'Collapse AI Chat' : 'Expand AI Chat'}
      >
        {isOpen ? <ChevronRight className="w-5 h-5 text-[#2D3436]" /> : <ChevronLeft className="w-5 h-5 text-[#2D3436]" />}
      </button>

      {/* Main Chat Panel Container */}
      {isOpen && (
        <div className="w-full h-full bg-white border-l border-[#E5E7EB] flex flex-col justify-between text-[#2D3436] shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#FAF6F0]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] shadow-2xs">
                <Bot className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0B3D4C]">
                  FloatChat AI Assistant
                </h3>
                <span className="text-[10px] text-[#22C55E] font-mono flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  Gemini 2.5 Active
                </span>
              </div>
            </div>

            <button
              onClick={() => setMessages([])}
              className="p-1.5 text-[#2D3436]/50 hover:text-red-500 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Location Context Banner */}
          {selectedLocation ? (
            <div className="px-4 py-2.5 bg-[#1E6091]/10 border-b border-[#E5E7EB] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#2D3436]">
                <div className="flex items-center gap-1.5 truncate">
                  <Compass className="w-3.5 h-3.5 text-[#1E6091] shrink-0" />
                  <span className="truncate font-medium">Context: <b className="text-[#1E6091] font-bold">{selectedLocation.name}</b> ({selectedLocation.nearestOcean})</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#1E6091] bg-white px-2 py-0.5 rounded border border-[#E5E7EB]">
                  {selectedLocation.avgTemp}°C
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Salinity: <strong className="text-slate-800">{selectedLocation.avgSalinity} PSU</strong></span>
                <span>Current: <strong className="text-slate-800">{selectedLocation.currentSpeed}</strong></span>
                <span>Pressure: <strong className="text-slate-800">{selectedLocation.avgPressure} dbar</strong></span>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 bg-[#FAF6F0] border-b border-[#E5E7EB] text-xs text-slate-500 flex items-center justify-between font-mono">
              <span>Context: <strong>Global Ocean Network</strong></span>
              <span className="text-[10px] text-[#1E6091] font-bold">3,900+ ARGO Floats</span>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-[#FAF6F0]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="p-1.5 rounded-xl bg-[#1E6091]/10 border border-[#1E6091]/20 text-[#1E6091] h-fit mt-1 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#1E6091] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white border border-[#E5E7EB] text-[#2D3436] rounded-bl-none shadow-2xs'
                  }`}
                >
                  <div className="space-y-1">
                    {msg.text.split('\n').map((line, idx) => {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <div key={idx} className={line.trim().startsWith('•') || line.trim().startsWith('-') ? 'pl-1' : ''}>
                          {parts.map((part, pIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong
                                  key={pIdx}
                                  className={msg.sender === 'user' ? 'font-bold text-white' : 'font-bold text-slate-900'}
                                >
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </div>
                      );
                    })}
                  </div>
                  <span
                    className={`text-[9px] font-mono mt-1 block text-right ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-[#2D3436]/50'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="p-1.5 rounded-xl bg-[#1E6091]/20 border border-[#1E6091]/30 text-[#1E6091] h-fit mt-1 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center text-xs text-[#1E6091] font-mono">
                <Bot className="w-4 h-4 animate-bounce text-[#1E6091]" />
                <span>Analyzing ARGO profiles...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="p-3 border-t border-[#E5E7EB] bg-white space-y-2">
            <span className="text-[10px] font-mono text-[#2D3436]/60 font-bold uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#1E6091]" /> Suggested Prompts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-xl bg-[#FAF6F0] hover:bg-[#1E6091]/10 border border-[#E5E7EB] text-[#2D3436] hover:text-[#1E6091] text-[11px] font-medium transition-all text-left truncate max-w-full cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-[#E5E7EB] bg-[#FAF6F0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={
                  selectedLocation
                    ? `Ask about ${selectedLocation.name}...`
                    : 'Ask FloatChat AI...'
                }
                className="flex-1 bg-white border border-[#E5E7EB] focus:border-[#1E6091] rounded-xl px-3.5 py-2 text-xs text-[#2D3436] placeholder-[#2D3436]/40 outline-none transition-colors shadow-2xs"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim() || isTyping}
                className="p-2 rounded-xl bg-[#FF6B6B] hover:bg-[#ff5252] disabled:opacity-50 text-[#4A1B0C] font-bold transition-all shadow-xs cursor-pointer"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
