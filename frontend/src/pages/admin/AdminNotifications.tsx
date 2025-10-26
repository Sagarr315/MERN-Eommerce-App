import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

interface Notification {
  _id: string;
  message: string;
  type: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axiosInstance.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notification =>
        notification._id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(notification =>
          axiosInstance.put(`/notifications/${notification._id}/read`)
        )
      );
      setNotifications(notifications.map(notification => 
        ({ ...notification, read: true })
      ));
      setUnreadCount(0);
    } catch (err) {
      setError('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '🛒';
      case 'user': return '👤';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) return (
    <div className="container text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Notifications 
          {unreadCount > 0 && (
            <span className="badge bg-danger ms-2">{unreadCount}</span>
          )}
        </h2>
        <div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="btn btn-outline-success me-2"
            >
              Mark All as Read
            </button>
          )}
          <button onClick={fetchNotifications} className="btn btn-outline-secondary">
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            All Notifications ({notifications.length})
            {unreadCount > 0 && (
              <span className="text-primary"> • {unreadCount} unread</span>
            )}
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`list-group-item list-group-item-action ${
                  !notification.read ? 'bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => !notification.read && markAsRead(notification._id)}
              >
                <div className="d-flex align-items-start">
                  <span className="me-3 fs-5">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''}`}>
                        {notification.message}
                      </h6>
                      {!notification.read && (
                        <span className="badge bg-primary">New</span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        User ID: {notification.userId.slice(-6)}
                      </small>
                      <small className="text-muted">
                        {getTimeAgo(notification.createdAt)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {notifications.length === 0 && (
            <div className="text-center py-5">
              <h5>No notifications</h5>
              <p className="text-muted">
                You're all caught up! Notifications will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;