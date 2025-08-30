import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../services/api';
import { useSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getNotifications({ 
        limit: 50, 
        unreadOnly: false 
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      // Don't decrement unreadCount here as we don't know if it was read or not
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="notification-sidebar open">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Notifications</h5>
        <div>
          {unreadCount > 0 && (
            <button 
              className="btn btn-sm btn-outline-primary me-2"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-bell fa-3x text-muted mb-3"></i>
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`notification-item p-3 border-bottom ${!notification.read ? 'bg-light' : ''}`}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-1">{notification.message}</p>
                  <small className="text-muted">
                    {formatDate(notification.createdAt)}
                  </small>
                </div>
                <div className="ms-2">
                  {!notification.read && (
                    <button 
                      className="btn btn-sm btn-outline-success me-1"
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                  )}
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteNotification(notification._id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;