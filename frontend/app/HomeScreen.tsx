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
  Alert,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { format } from "date-fns"
import * as Location from "expo-location"
import NavigationBar from "../components/NavigationBar"
import * as Linking from "expo-linking"
// Add this import at the top of the file
import { testLocationPermission } from "../services/locationTest"
import React from "react"
import { StatusBar } from "expo-status-bar"
import { Link } from "expo-router"



const { width, height } = Dimensions.get("window")

// OpenWeatherMap API key - replace with your own
const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"
// Google Maps API key - replace with your own
const MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"

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
  latitude?: number
  longitude?: number
}

// Mock team data
const MOCK_TEAM_DATA: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
]

export default function HomeScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTeam, setCurrentTeam] = useState<TeamMember[]>([])
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [locationPermission, setLocationPermission] = useState(false)

  useEffect(() => {
    console.log("HomeScreen mounted, requesting location permission")
    requestLocationPermission()

    // Add a cleanup function
    return () => {
      console.log("HomeScreen unmounted")
    }
  }, [])

  const requestLocationPermission = async () => {
    try {
      // First check if we already have permissions
      let { status } = await Location.getForegroundPermissionsAsync()

      // If we don't have permission, request it
      if (status !== "granted") {
        console.log("Requesting location permission...")
        const permissionResponse = await Location.requestForegroundPermissionsAsync()
        status = permissionResponse.status
        console.log("Permission response:", status)
      }

      setLocationPermission(status === "granted")

      if (status === "granted") {
        // Permission was granted, fetch location data
        fetchLocationData()
      } else {
        // Permission was denied, show alert
        Alert.alert(
          "Location Permission Required",
          "This app needs access to your location to show weather and nearby information. Please enable location services in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                // Open app settings if available
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:")
                } else {
                  Linking.openSettings()
                }
              },
            },
          ],
        )

        // Use default data
        setLoading(true)
        setCurrentTeam(MOCK_TEAM_DATA)
        setLocationInfo({
          name: "Unknown Location",
          description: "Enable location services to see details about your area",
          temperature: 0,
          image:
            "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
          mapImage: `https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=10&size=400x200&key=${MAPS_API_KEY}`,
        })
        setLoading(false)
      }
    } catch (err) {
      console.error("Error requesting location permission:", err)
      setError("Failed to request location permission")
      setLoading(false)
    }
  }

  const fetchLocationData = async () => {
    setLoading(true)
    setError("")
    try {
      console.log("Fetching current location...")
      // Get current location with a timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // 5 seconds
        mayShowUserSettingsDialog: true, // This will prompt the user to enable location services if they're off
      })

      console.log("Location received:", location)
      const { latitude, longitude } = location.coords

      // Get location name from coordinates
      console.log("Reverse geocoding...")
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      })

      console.log("Geocode result:", geocode)

      const locationName = geocode[0]?.city || geocode[0]?.region || geocode[0]?.subregion || "Unknown Location"

      const country = geocode[0]?.country || ""

      // For testing, we'll use mock weather data instead of making an API call
      // In a real app, you would uncomment the API call below
      console.log("Setting mock weather data")
      const weatherData = {
        main: { temp: 22 },
        weather: [{ description: "Clear sky" }],
      }

      /*
      // Fetch weather data
      console.log("Fetching weather data...");
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );
      
      if (!weatherResponse.ok) {
        throw new Error("Weather data not available");
      }
      
      const weatherData = await weatherResponse.json();
      console.log("Weather data received:", weatherData);
      */

      // Use a static image for now
      const locationImage =
        "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"

      // Create map image URL
      const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=13&size=400x200&markers=color:red%7C${latitude},${longitude}&key=${MAPS_API_KEY}`

      console.log("Setting location info")
      // Set location info
      setLocationInfo({
        name: locationName,
        description: weatherData.weather[0]?.description || "No weather description available",
        temperature: Math.round(weatherData.main?.temp) || 0,
        image: locationImage,
        mapImage: mapImageUrl,
        latitude,
        longitude,
      })

      // Set team data (mock for now)
      setCurrentTeam(MOCK_TEAM_DATA)
    } catch (err) {
      console.error("Error fetching location data:", err)
      setError("Failed to fetch location data: " + (err instanceof Error ? err.message : String(err)))

      // Set default data on error
      setLocationInfo({
        name: "Unknown Location",
        description: "Could not fetch location details",
        temperature: 0,
        image:
          "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        mapImage: `https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=10&size=400x200&key=${MAPS_API_KEY}`,
      })
      setCurrentTeam(MOCK_TEAM_DATA)
    } finally {
      setLoading(false)
    }
  }

  const fetchLocationImage = async (locationName: string): Promise<string> => {
    try {
      // Use Unsplash API to get a relevant image
      // Note: In a real app, you should use your own Unsplash API key
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${locationName}&client_id=YOUR_UNSPLASH_API_KEY`,
      )

      if (!response.ok) {
        throw new Error("Could not fetch location image")
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular
      }

      // Fallback image
      return "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    } catch (err) {
      console.error("Error fetching location image:", err)
      // Fallback image
      return "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    }
  }

  const handleJoinTeam = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add a new team member
      const newMember = {
        id: "4",
        name: "You",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      }

      setCurrentTeam([...currentTeam, newMember])
    } catch (err) {
      console.error("Error joining team:", err)
      Alert.alert("Error", "Failed to join team. Please try again.")
    }
  }

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  const handleRefresh = () => {
    if (locationPermission) {
      fetchLocationData()
    } else {
      requestLocationPermission()
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching location data...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="inverted" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Image source={require("../assets/images/arrow-small-left.png")} style={styles.menuIcon} />
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
            <Image source={require("../assets/images/profile/0d19fe1c-1a37-4dc8-a582-9441af5ef8c5.png")} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile" as never)}>
          <Image source={require("../assets/images/profile/9a893182-d17f-4cd1-92be-e15f7bc7d227.png")} style={styles.profilePic} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Current Team Card */}
        <View style={styles.teamCard}>
          <Text style={styles.cardTitle}>Current Team</Text>
          <Text style={styles.dateTime}>{format(new Date(), "EEE, MMM dd h:mm a").toUpperCase()}</Text>
          <Text style={styles.location}>
            {locationInfo?.name}
            {locationInfo?.name && ", "}
            {locationPermission ? "Near You" : "Enable Location"}
          </Text>
          <View style={styles.teamMembers}>
            {currentTeam.map((member, index) => (
              <View key={member.id} style={[styles.memberAvatarContainer, { marginLeft: index > 0 ? -10 : 0 }]}>
                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
              </View>
            ))}
          </View>

          <View style={styles.joinCreateButtons}>
            <Link href="/enterTeamCode" asChild>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>JOIN</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/createTeam" asChild>
              <TouchableOpacity style={styles.createButton}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Location Card */}
        {locationInfo && (
          <View style={styles.locationCard}>
            <Image source={{ uri: locationInfo.image }} style={styles.locationImage} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{locationInfo.name}</Text>
              <Text style={styles.locationDescription}>{locationInfo.description}</Text>
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperature}>{locationInfo.temperature}°C</Text>
                <Image source={require("../assets/images/arrow-small-left.png")} style={styles.weatherIcon} />
              </View>
              {!locationPermission && (
                <TouchableOpacity
                  style={[styles.enableLocationButton, { marginTop: 15, paddingVertical: 12 }]}
                  onPress={() => {
                    console.log("Enable location button pressed")
                    requestLocationPermission()
                  }}
                >
                  <Text style={styles.enableLocationText}>Enable Location Services</Text>
                </TouchableOpacity>
              )}
            </View>
            <Image source={{ uri: locationInfo.mapImage }} style={styles.mapImage} />
            <View style={styles.teamIndicator}>
              {currentTeam.slice(0, 3).map((member, index) => (
                <View
                  key={member.id}
                  style={[styles.teamIndicatorAvatarContainer, { marginLeft: index > 0 ? -10 : 0 }]}
                >
                  <Image source={{ uri: member.avatar }} style={styles.teamIndicatorAvatar} />
                </View>
              ))}
              {currentTeam.length > 3 && <Text style={styles.teamIndicatorCount}>+{currentTeam.length - 3}</Text>}
            </View>
          </View>
        )}

        
      </ScrollView>

      <NavigationBar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    marginTop: 10,
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginTop: 20,
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
    width: 30,
    height: 30,
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
  memberAvatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  memberAvatar: {
    width: "100%",
    height: "100%",
  },
  joinCreateButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  joinButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  createButton: {
    backgroundColor: "#007BFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  createButtonText: {
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
  teamIndicatorAvatarContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  teamIndicatorAvatar: {
    width: "100%",
    height: "100%",
  },
  teamIndicatorCount: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
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
  refreshButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  enableLocationButton: {
    backgroundColor: "#FF9800",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 15,
    alignSelf: "center",
    width: "80%",
  },
  enableLocationText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
})

