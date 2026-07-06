import React, { useState, useRef, useEffect } from 'react';
import { HiChatBubbleLeftRight, HiXMark, HiPaperAirplane } from 'react-icons/hi2';

const VehicleChatbot = ({ vehicles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the RideEasy assistant. How can I help you find a vehicle today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const formatMessage = (content) => {
    if (!content) return null;
    return content.split('\n').map((line, index) => {
      let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formatted = formatted.replace(/^\s*[\*\-]\s+/g, '• ');
      return (
        <span key={index}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          <br />
        </span>
      );
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const systemPrompt = `You are a helpful assistant for RideEasy, a vehicle rental platform.
Available vehicles in our database: ${JSON.stringify(vehicles.map(v => ({ name: v.name, type: v.type, pricePerDay: v.pricePerDay, location: v.location, isAvailable: v.isAvailable }))) }.
Answer customer questions about our vehicles, payments (Razorpay), availability, and the platform. Be concise, friendly, and format your responses nicely.`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages,
            userMsg
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      console.log('Groq API Response:', data);
      
      if (!response.ok) {
        console.error('Groq API Error:', data);
        setMessages(prev => [...prev, { role: 'assistant', content: `API Error: ${data.error?.message || response.statusText}` }]);
      } else if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, data.choices[0].message]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I received an empty response.' }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Network Error: ${error.message}` }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-primary-600 text-white rounded-full shadow-xl hover:bg-primary-700 transition-all z-50 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <HiChatBubbleLeftRight className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '500px', maxHeight: '80vh' }}>
        {/* Header */}
        <div className="bg-primary-600 p-4 text-white flex justify-between items-center shadow-md z-10">
          <div className="flex items-center gap-2">
            <HiChatBubbleLeftRight className="w-5 h-5" />
            <h3 className="font-medium">RideEasy Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-primary-700 p-1 rounded-md transition-colors">
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50 custom-scrollbar">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white text-surface-900 border border-surface-100 rounded-bl-sm'}`}>
                <div className="text-sm">{formatMessage(msg.content)}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-surface-900 shadow-sm border border-surface-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-surface-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-surface-100">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about vehicles..."
              className="flex-1 bg-surface-50 border border-transparent focus:border-primary-500 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiPaperAirplane className="w-5 h-5 -rotate-45 ml-0.5 mb-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VehicleChatbot;
