import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data.notifications || []);
      setUnreadCount(response.data.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async () => {
    try {
      await api.patch('/notifications/read');
      setUnreadCount(0);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (unreadCount > 0) handleMarkRead();
        }}
        className="relative p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-strong)] hover:bg-[var(--color-bg-component-subtle)] transition-colors"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-12 z-50 w-80 rounded-xl bg-[var(--color-bg-component)] p-4 shadow-2xl border border-[var(--color-border)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 mb-3">
              <h4 className="font-bold text-sm text-[var(--color-text-strong)]">Notifications & Alerts</h4>
              <button onClick={handleMarkRead} className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1">
                <Check size={12} /> Mark all read
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n._id} className={`p-2.5 rounded-lg border text-xs ${n.isRead ? 'bg-transparent border-[var(--color-border-subtle)] text-[var(--color-text-muted)]' : 'bg-[var(--color-bg-component-subtle)] border-[var(--color-primary)] text-[var(--color-text-strong)] font-medium'}`}>
                    <p className="font-bold mb-0.5">{n.title}</p>
                    <p>{n.message}</p>
                    <span className="text-[9px] opacity-70 mt-1 block">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-xs text-[var(--color-text-muted)]">No notifications yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
