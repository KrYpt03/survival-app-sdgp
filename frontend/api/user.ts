import { API_CONFIG } from './config';

export interface User {
    user: {
        userID: string;
    }
}

export const userApi = {
  getUser: async (clerkId: string): Promise<User> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/user?clerkId=${clerkId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  // Other auth-related endpoints
};