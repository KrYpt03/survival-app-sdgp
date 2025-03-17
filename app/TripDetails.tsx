"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native"
import { useRoute, useNavigation, type RouteProp } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { type Trip, tripService } from "../services/tripService"
import React from "react"

type RouteParams = {
  TripDetails: {
    tripId: string
  }
}

const { width } = Dimensions.get("window")

const TripDetails = () => {
  const route = useRoute<RouteProp<RouteParams, "TripDetails">>()
  const navigation = useNavigation<any>()
  const { tripId } = route.params

  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, you would use the API call
        // const data = await tripService.getTripById(tripId);

        // For demo purposes, using mock data
        const allTrips = tripService.getMockTrips()
        const tripData = allTrips.find((t) => t.id === tripId)

        if (!tripData) {
          throw new Error("Trip not found")
        }

        setTrip(tripData)
      } catch (err) {
        console.error("Failed to fetch trip details:", err)
        setError("Failed to load trip details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTripDetails()
  }, [tripId])

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </SafeAreaView>
    )
  }

  if (error || !trip) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Trip not found"}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: trip.imageUrl }} style={styles.headerImage} />
        <View style={styles.headerOverlay} />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Trip Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{trip.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#fff" />
            <Text style={styles.locationText}>{trip.location}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Trip Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color="#4285F4" />
              <Text style={styles.infoLabel}>Dates</Text>
              <Text style={styles.infoValue}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color="#4285F4" />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{trip.days} Days</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="map-outline" size={20} color="#4285F4" />
              <Text style={styles.infoLabel}>Places</Text>
              <Text style={styles.infoValue}>{trip.places} Locations</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="camera-outline" size={20} color="#4285F4" />
              <Text style={styles.infoLabel}>Photos</Text>
              <Text style={styles.infoValue}>{trip.photos} Images</Text>
            </View>
          </View>
        </View>

        {/* Trip Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About This Trip</Text>
          <Text style={styles.descriptionText}>
            Experience the beauty and adventure of {trip.location}. This trip included visits to multiple scenic
            locations, cultural experiences, and unforgettable moments.
          </Text>
        </View>

        {/* Photos Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photosContainer}>
            {/* Mock photos - in a real app, these would come from the API */}
            {[1, 2, 3, 4, 5].map((item) => (
              <Image
                key={item}
                source={{
                  uri: `https://source.unsplash.com/random/300x200?${trip.location.split(",")[0]}&sig=${item}`,
                }}
                style={styles.photoThumbnail}
              />
            ))}
          </ScrollView>
        </View>

        {/* Places Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Places Visited</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Mock places - in a real app, these would come from the API */}
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.placeItem}>
              <Image
                source={{
                  uri: `https://source.unsplash.com/random/100x100?${trip.location.split(",")[0]}&sig=${item + 10}`,
                }}
                style={styles.placeImage}
              />
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>
                  {trip.location.includes("Paris")
                    ? ["Eiffel Tower", "Louvre Museum", "Notre-Dame"][item - 1]
                    : trip.location.includes("Ella")
                      ? ["Nine Arch Bridge", "Little Adam's Peak", "Ravana Falls"][item - 1]
                      : ["Landmark " + item, "Attraction " + item, "Sight " + item][item - 1]}
                </Text>
                <Text style={styles.placeDescription}>
                  Visited on {format(new Date(trip.startDate), "MMM d, yyyy")}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  headerContainer: {
    height: 250,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4285F4",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666",
  },
  photosContainer: {
    paddingVertical: 8,
  },
  photoThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  placeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  placeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  placeDescription: {
    fontSize: 12,
    color: "#999",
  },
  backButtonText: {
    color: "#4285F4",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default TripDetails

