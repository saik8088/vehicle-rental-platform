import api from '../../utils/api';

const API_URL = '/api/notifications/';

// Get user notifications
const getNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(API_URL, config);
  return response.data;
};

// Mark all as read
const markAllAsRead = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.put(API_URL, {}, config);
  return response.data;
};

const notificationService = {
  getNotifications,
  markAllAsRead,
};

export default notificationService;
