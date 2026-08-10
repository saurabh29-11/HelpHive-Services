import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader } from 'lucide-react';
import api from '../api/axios'; // Import your configured axios instance

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! I am the HelpHive Assistant. How can I help you?', sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false); // To track if the bot is "thinking"
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || loading) return;

    const userMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    // Add a temporary "thinking" message for the bot
    const thinkingMessageId = Date.now() + 1;
    setMessages(prev => [...prev, { id: thinkingMessageId, sender: 'bot', thinking: true }]);

    try {
      // Call your new backend endpoint
      const response = await api.post('/chatbot/query', {
        message: inputValue,
      });

      const botReply = response.data.data.reply;

      // Replace the "thinking" message with the actual reply
      setMessages(prev =>
        prev.map(msg =>
          msg.id === thinkingMessageId ? { ...msg, text: botReply, thinking: false } : msg
        )
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Sorry, I'm having trouble connecting right now.";
      // Replace the "thinking" message with an error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === thinkingMessageId ? { ...msg, text: errorMessage, thinking: false, error: true } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleOpen}
          className="btn btn-primary h-16 w-16 rounded-full !p-0 shadow-2xl flex items-center justify-center"
        >
          <AnimatePresence>
            {isOpen ? (
              <motion.div key="close" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} >
                <X size={32} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <MessageSquare size={32} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-28 right-8 z-50 w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-component)] shadow-2xl flex flex-col h-[70vh] max-h-[500px]"
          >
            {/* Chat Header */}
            <header className="flex items-center justify-between p-4 border-b border-[var(--color-border-subtle)]">
              <h3 className="text-lg font-bold text-[var(--color-text-strong)]">HelpHive Assistant</h3>
              <button onClick={toggleOpen} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]"><X size={20} /></button>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                   {msg.sender === 'bot' && <div className="h-8 w-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-lg self-end">🐝</div>}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-[var(--color-primary)] text-white rounded-br-none'
                        : msg.error ? 'bg-red-500/20 text-red-300 rounded-bl-none' : 'bg-[var(--color-bg-component-subtle)] text-[var(--color-text)] rounded-bl-none'
                    }`}
                  >
                    {msg.thinking ? (
                      <div className="flex items-center gap-2">
                        <motion.div className="h-2 w-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} />
                        <motion.div className="h-2 w-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                        <motion.div className="h-2 w-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <footer className="p-4 border-t border-[var(--color-border-subtle)]">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 !py-2"
                  disabled={loading}
                />
                <button type="submit" className="btn btn-primary !rounded-lg !px-4 !py-2" disabled={loading}>
                    {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Send size={20}/>}
                </button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;