import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Sends HTTP-only cookies for JWT auth
});

// Request interceptor — attach JWT from localStorage if cookie auth is unavailable
api.interceptors.request.use(
  (config) => {
    // If using token-based auth fallback (set in Phase 5)
    const token = localStorage.getItem('rideeasy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect
      localStorage.removeItem('rideeasy_token');
      // Auth context will handle redirect — this is a safety net
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
