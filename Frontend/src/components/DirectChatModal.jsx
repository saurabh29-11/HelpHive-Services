import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Video, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DirectChatModal = ({ booking, show, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!booking?._id) return;
    try {
      const response = await api.get(`/chats/booking/${booking._id}`);
      setMessages(response.data.data);
    } catch (err) {
      console.error("Failed to fetch chat:", err);
    }
  };

  useEffect(() => {
    if (show && booking?._id) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000); // Poll every 4 seconds
      return () => clearInterval(interval);
    }
  }, [show, booking]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e, isVideoCall = false) => {
    if (e) e.preventDefault();
    if (!isVideoCall && (!inputText || inputText.trim() === '')) return;

    setLoading(true);
    try {
      const response = await api.post('/chats/send', {
        bookingId: booking._id,
        message: isVideoCall ? "📹 Video Interview Call Initiated" : inputText,
        isVideoCallRequest: isVideoCall
      });

      if (response.data.success) {
        setInputText('');
        fetchMessages();
        if (isVideoCall) {
            toast.success("📹 Video Call Link Generated!");
            window.open(response.data.data.videoCallUrl, '_blank');
        }
      }
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !booking) return null;

  const otherPersonName = user?._id === booking.client?._id ? booking.helper?.fullName : booking.client?.fullName;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="relative h-full w-full max-w-md rounded-2xl bg-[var(--color-bg-component)] shadow-2xl flex flex-col overflow-hidden border border-[var(--color-border)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-bg-component-subtle)]">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-[var(--color-primary)]" />
              <div>
                <h3 className="font-bold text-[var(--color-text-strong)]">{otherPersonName || 'Chat'}</h3>
                <p className="text-xs text-[var(--color-text-muted)]">Live Interview & Duty Discussion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleSendMessage(e, true)}
                className="btn bg-indigo-600 hover:bg-indigo-700 text-white !px-3 !py-1.5 text-xs flex items-center gap-1.5 font-bold shadow-md"
                title="Start 1-Click Video Call"
              >
                <Video size={16} /> <span>1-Click Video Call</span>
              </button>
              <button onClick={onClose} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)]">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-bg)]">
            {messages.length > 0 ? (
              messages.map(msg => {
                const isMe = msg.sender?._id === user?._id;
                return (
                  <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm shadow-md ${isMe ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-bg-component-subtle)] text-[var(--color-text)] border border-[var(--color-border)]'}`}>
                      <p>{msg.message}</p>
                      {msg.videoCallUrl && (
                        <a
                          href={msg.videoCallUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block rounded bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow hover:bg-indigo-700"
                        >
                          📹 Join Video Call Room
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)] mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-xs text-[var(--color-text-muted)]">
                No messages yet. Start discussing salary, timings, or start a 1-Click Video Call!
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={(e) => handleSendMessage(e, false)} className="p-3 border-t border-[var(--color-border)] bg-[var(--color-bg-component-subtle)] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 !py-2 !px-3 text-sm rounded-lg border border-[var(--color-border)]"
            />
            <button type="submit" className="btn btn-primary !p-2.5" disabled={loading}>
              <Send size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DirectChatModal;
