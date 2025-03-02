"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { format } from "date-fns"
import axios from "axios" // Make sure to install axios: npm install axios

const { width, height } = Dimensions.get("window")

interface TeamMember {
  id: string
  name: string
  avatar: string
}

interface LocationInfo {
  name: string
  description: string
  temperature: number
  image: string
  mapImage: string
}

const API_BASE_URL = "https://your-api-base-url.com" // Replace with your actual API base URL

export default function HomeScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([])
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError("")
    try {
      const [teamResponse, locationResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/team`),
        axios.get(`${API_BASE_URL}/location`),
      ])

      setCurrentTeam(teamResponse.data)
      setLocationInfo(locationResponse.data)
    } catch (err) {
      console.error("Error fetching data:", err)
      if (axios.isAxiosError(err)) {
        setError(`Network error: ${err.message}`)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async () => {
    try {
      await axios.post(`${API_BASE_URL}/team/join`)
      // Refresh team data after joining
      const response = await axios.get(`${API_BASE_URL}/team`)
      setCurrentTeam(response.data)
    } catch (err) {
      console.error("Error joining team:", err)
      // Handle error (e.g., show an alert to the user)
    }
  }

}
