import { API_CONFIG } from './config';

export interface Team {
    teamID: string;
}

export const teamApi = {
  getUserTeam: async (userId: string): Promise<Team> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/team/user/${userId}`, {
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