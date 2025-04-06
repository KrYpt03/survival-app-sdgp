import { API_CONFIG } from './config';

export interface UserLocation {
    userId: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
}

export const locationApi = {
  getTeamLocation: async (teamId: string): Promise<UserLocation[]> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/location/team/${teamId}`, {
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
  updateUserLocation: async (clerkId: string, latitude: number, longitude: number): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/location/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: clerkId,
            latitude,
            longitude
        })
      });
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};