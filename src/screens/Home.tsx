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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Image source={require("../../assets/profile/742ef63e-eb0e-4b6d-ac71-268c589ac9eb.png")} style={styles.menuIcon} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Image source={require("../../assets/profile/0d19fe1c-1a37-4dc8-a582-9441af5ef8c5.png")} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleNavigate("Profile")}>
          <Image source={require("../../assets/profile/9a893182-d17f-4cd1-92be-e15f7bc7d227.png")} style={styles.profilePic} />
        </TouchableOpacity>
      </View>

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

        {/* Location Card */}
        {locationInfo && (
          <View style={styles.locationCard}>
            <Image source={{ uri: locationInfo.image }} style={styles.locationImage} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{locationInfo.name}</Text>
              <Text style={styles.locationDescription}>{locationInfo.description}</Text>
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{locationInfo.temperature}°</Text>
                <Image source={require("../../assets/weather-icon.png")} style={styles.weatherIcon} />
              </View>
            </View>
            <Image source={{ uri: locationInfo.mapImage }} style={styles.mapImage} />
            <View style={styles.teamIndicator}>
              {currentTeam.slice(0, 3).map((member, index) => (
                <Image
                  key={member.id}
                  source={{ uri: member.avatar }}
                  style={[styles.teamIndicatorAvatar, { marginLeft: index > 0 ? -10 : 0 }]}
                />
              ))}
              {currentTeam.length > 3 && <Text style={styles.teamIndicatorCount}>+{currentTeam.length - 3}</Text>}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Navigation Bar */}
      <View style={styles.navigationBar}>
        {navigationItems.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <ImageBackground source={item.icon} style={styles.navIcon} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const navigationItems = [
  {
    icon: require("../../assets/profile/4757d4cc-108a-4570-8e32-ac0514f1c5b2.png"),
    onPress: () => handleNavigate("Home"),
  },
  {
    icon: require("../../assets/profile/0d19fe1c-1a37-4dc8-a582-9441af5ef8c5.png"),
    onPress: () => handleNavigate("Search"),
  },
  {
    icon: require("../../assets/profile/bd137700-8dc1-48fb-92c2-08643c077010.png"),
    onPress: () => handleNavigate("Explore"),
  },
  {
    icon: require("../../assets/profile/0415227a-9b94-4632-a21b-4c46d2f8432c.png"),
    onPress: () => handleNavigate("Inbox"),
  },
  {
    icon: require("../../assets/profile/46f352d9-70f6-4c9e-886c-768bcf1746b8.png"),
    onPress: () => handleNavigate("Profile"),
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECE6F0",
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  teamCard: {
    backgroundColor: "#87CEEB",
    borderRadius: 20,
    margin: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  location: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  teamMembers: {
    flexDirection: "row",
    marginBottom: 16,
  },
  memberAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    margin: 16,
    overflow: "hidden",
  },
  locationImage: {
    width: "100%",
    height: 200,
  },
  locationInfo: {
    padding: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  weatherIcon: {
    width: 24,
    height: 24,
  },
  mapImage: {
    width: "100%",
    height: 100,
  },
  teamIndicator: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  teamIndicatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  teamIndicatorCount: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f3edf7",
    borderRadius: 25,
    margin: 16,
    padding: 16,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
  },
})

function handleNavigate(arg0: string) {
    throw new Error("Function not implemented.")
}

