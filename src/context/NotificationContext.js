import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/user.service';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const result = await userService.getNotifications();
      if (result.success) {
        setNotifications(result.notifications || []);
        setUnread(result.unread || 0);
      }
    } catch {}
  };

  const markRead = async (id) => {
    await userService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await userService.markNotificationRead('all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unread, markRead, markAllRead, reload: loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
