import api from '../../utils/api';

const API_URL = '/api/users/';

// Get all users (Admin only)
const getUsers = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.get(API_URL, config);
  return response.data;
};

// Delete user (Admin only)
const deleteUser = async (userId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.delete(API_URL + userId, config);
  return response.data;
};

const userService = {
  getUsers,
  deleteUser,
};

export default userService;
