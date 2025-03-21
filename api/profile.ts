export interface Profile {
  id: string;
  name: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
  profileImage: string;
  rewardPoints: number;
  travelTrips: number;
  bucketList: number;
}

export interface EditableProfile {
  name?: string;
  bio?: string;
  phone?: string;
  location?: string;
  profileImage?: string;
}

export const profileAPI = {
  getProfile: async (token: string): Promise<Profile> => {
    // Mock API call - replace with actual API call
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Adventure enthusiast and nature lover',
      phone: '+1 234 567 8900',
      location: 'New York, USA',
      profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
      rewardPoints: 1250,
      travelTrips: 15,
      bucketList: 8,
    };
  },

  updateProfile: async (token: string, data: EditableProfile): Promise<Profile> => {
    // Mock API call - replace with actual API call
    return {
      id: '1',
      name: data.name || 'John Doe',
      email: 'john@example.com',
      bio: data.bio || 'Adventure enthusiast and nature lover',
      phone: data.phone || '+1 234 567 8900',
      location: data.location || 'New York, USA',
      profileImage: data.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
      rewardPoints: 1250,
      travelTrips: 15,
      bucketList: 8,
    };
  },
};