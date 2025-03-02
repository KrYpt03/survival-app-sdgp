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

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  <ScrollView style={styles.content}>
        {/* Current Team Card */}
        <View style={styles.teamCard}>
          <Text style={styles.cardTitle}>Current Team</Text>
          <Text style={styles.dateTime}>{format(new Date(), "EEE, MMM dd h:mm a").toUpperCase()}</Text>
          <Text style={styles.location}>{locationInfo?.name}, Finland</Text>
          <View style={styles.teamMembers}>
            {currentTeam.map((member, index) => (
              <Image
                key={member.id}
                source={{ uri: member.avatar }}
                style={[styles.memberAvatar, { marginLeft: index > 0 ? -10 : 0 }]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinTeam}>
            <Text style={styles.joinButtonText}>JOIN</Text>
          </TouchableOpacity>
        </View>

}
