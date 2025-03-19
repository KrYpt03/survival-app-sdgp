import { API_CONFIG } from './config';

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  // Other auth-related endpoints
};