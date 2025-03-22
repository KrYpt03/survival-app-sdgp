import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '@clerk/clerk-expo';

// Create axios instance with deployed URL
const api = axios.create({
  baseURL: 'https://trail-guard.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for CORS with credentials
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('clerk-session-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error adding auth token:', error);
    return Promise.reject(error);
  }
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - token may be expired');
      // Try to refresh the token here if needed
      try {
        const newToken = await SecureStore.getItemAsync('clerk-session-token');
        if (newToken && error.config) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios.request(error.config);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    } else if (error.response?.status === 403) {
      console.log('Forbidden - insufficient permissions');
    } else {
      console.error('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 