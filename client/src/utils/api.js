import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to attach the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config && error.config.url && error.config.url.includes('/auth/login');
    
    if (error.response && error.response.status === 401 && !isLoginRoute) {
      // Clear local storage and redirect if token is expired/invalid (but not during login)
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
