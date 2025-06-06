import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { env } from '../config/env'

// Define your API base URL
const API_BASE_URL = env.tripApiBaseUrl

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Define Trip interface
export interface Trip {
  id: string
  title: string
  location: string
  startDate: string
  endDate: string
  days: number
  places: number
  photos: number
  imageUrl: string
  year: number
}

// Trip service with API methods
export const tripService = {
  // Get all trips
  getTrips: async (): Promise<Trip[]> => {
    try {
      const response = await api.get("/trips")
      return response.data
    } catch (error) {
      console.error("Error fetching trips:", error)
      throw error
    }
  },

  // Get trip by ID
  getTripById: async (tripId: string): Promise<Trip> => {
    try {
      const response = await api.get(`/trips/${tripId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching trip ${tripId}:`, error)
      throw error
    }
  },

  // Search trips by query
  searchTrips: async (query: string): Promise<Trip[]> => {
    try {
      const response = await api.get(`/trips/search?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error("Error searching trips:", error)
      throw error
    }
  },

  // Filter trips by year
  filterTripsByYear: async (year: number | string): Promise<Trip[]> => {
    try {
      const response = await api.get(`/trips/filter?year=${year}`)
      return response.data
    } catch (error) {
      console.error(`Error filtering trips by year ${year}:`, error)
      throw error
    }
  },

  // Mock data for testing (when backend is not available)
  getMockTrips: (): Trip[] => {
    return [
      {
        id: "1",
        title: "Ella",
        location: "Ella",
        startDate: "2024-01-15",
        endDate: "2024-01-22",
        days: 7,
        places: 12,
        photos: 89,
        imageUrl:
          "https://images.unsplash.com/photo-1566766189268-ecac9118f2b7?fm=jpg&amp;q=60&amp;w=3000&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        year: 2024,
      },
      {
        id: "2",
        title: "Nuwareliya Eliya",
        location: "Nuwara eliya",
        startDate: "2023-06-15",
        endDate: "2023-06-22",
        days: 7,
        places: 12,
        photos: 89,
        imageUrl:
          "https://images.unsplash.com/photo-1586193804147-64d5c02ef9c1?fm=jpg&amp;q=60&amp;w=3000&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        year: 2023,
      },
      {
        id: "3",
        title: "Devil Staircase",
        location: "Devil Staircase",
        startDate: "2023-11-10",
        endDate: "2023-11-20",
        days: 10,
        places: 15,
        photos: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1578517929034-db013fd86597?q=80&w=3348&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        year: 2023,
      },
      {
        id: "4",
        title: "New York City",
        location: "New York, USA",
        startDate: "2024-03-05",
        endDate: "2024-03-12",
        days: 7,
        places: 10,
        photos: 75,
        imageUrl:
          "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        year: 2024,
      },
      {
        id: "5",
        title: "Bali Retreat",
        location: "Bali, Indonesia",
        startDate: "2025-01-15",
        endDate: "2025-01-30",
        days: 15,
        places: 8,
        photos: 150,
        imageUrl:
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        year: 2025,
      },
    ]
  },
}

