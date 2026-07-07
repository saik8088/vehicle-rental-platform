import api from '../../utils/api';

const API_URL = '/settings/';

// Get settings
const getSettings = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Update settings (Admin only)
const updateSettings = async (settingsData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.put(API_URL, settingsData, config);
  return response.data;
};

const settingsService = {
  getSettings,
  updateSettings,
};

export default settingsService;
