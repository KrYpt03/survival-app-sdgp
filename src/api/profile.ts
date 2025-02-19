// Define profile types
export interface Profile {
  name: string
  email: string
  rewardPoints: number
  travelTrips: number
  bucketList: number
}

// Mock API function to get profile data
export const profileAPI = {
  getProfile: async (token: string): Promise<Profile> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock response
    return {
      name: "Leonardo",
      email: "Leonardo@gmail.com",
      rewardPoints: 360,
      travelTrips: 238,
      bucketList: 473,
    }
  },
}

