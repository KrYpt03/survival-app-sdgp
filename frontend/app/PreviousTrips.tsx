"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { format } from "date-fns"
import { Ionicons } from "@expo/vector-icons"
import { type Trip, tripService } from "../services/tripService"
import NavigationBar from "../components/NavigationBar"
import React from "react"

const { width } = Dimensions.get("window")

const FILTER_OPTIONS = ["All", "This Year", "2024", "2025"]

const PreviousTrips = () => {
  const navigation = useNavigation<any>()
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState("All")

  // Fetch trips from API
  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real app, you would use the API call
      // const data = await tripService.getTrips();

      // For demo purposes, using mock data
      const data = tripService.getMockTrips()

      setTrips(data)
      setFilteredTrips(data)
    } catch (err) {
      console.error("Failed to fetch trips:", err)
      setError("Failed to load trips. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchTrips()
  }, [fetchTrips])

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchTrips()
    setRefreshing(false)
  }, [fetchTrips])

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text)
    if (!text.trim()) {
      applyFilter(selectedFilter)
      return
    }

    const searchResults = trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(text.toLowerCase()) ||
        trip.location.toLowerCase().includes(text.toLowerCase()),
    )
    setFilteredTrips(searchResults)
  }

  // Apply filter
  const applyFilter = (filter: string) => {
    setSelectedFilter(filter)

    let filtered: Trip[]
    const currentYear = new Date().getFullYear()

    switch (filter) {
      case "This Year":
        filtered = trips.filter((trip) => trip.year === currentYear)
        break
      case "2024":
        filtered = trips.filter((trip) => trip.year === 2024)
        break
      case "2025":
        filtered = trips.filter((trip) => trip.year === 2025)
        break
      default:
        filtered = [...trips]
    }

    setFilteredTrips(filtered)

    // If there's a search query, apply it to the filtered results
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTrips(filtered)
    }
  }

  // Navigate to trip details
  const navigateToTripDetails = (trip: Trip) => {
    navigation.navigate("TripDetails", { tripId: trip.id })
  }

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`
  }

  // Render trip card
  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard} onPress={() => navigateToTripDetails(item)} activeOpacity={0.9}>
      <Image source={{ uri: item.imageUrl }} style={styles.tripImage} />
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle}>{item.title}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <Text style={styles.dateText}>{formatDateRange(item.startDate, item.endDate)}</Text>
        <View style={styles.tripStats}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.days} Days</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.places} places</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="camera-outline" size={16} color="#666" />
            <Text style={styles.statText}>{item.photos} Photos</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Render filter options
  const renderFilterOption = (option: string) => (
    <TouchableOpacity
      key={option}
      style={[styles.filterOption, selectedFilter === option && styles.selectedFilterOption]}
      onPress={() => applyFilter(option)}
    >
      <Text style={[styles.filterText, selectedFilter === option && styles.selectedFilterText]}>{option}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Previous Trips</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your trips"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>{FILTER_OPTIONS.map(renderFilterOption)}</View>

      {/* Trip List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchTrips}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTrips}
          renderItem={renderTripCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No trips found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery ? "Try a different search term" : "You haven't taken any trips yet"}
              </Text>
            </View>
          }
        />
      )}

      {/* Bottom Navigation */}
      <NavigationBar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: 56,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  menuButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F0F0F0",
  },
  selectedFilterOption: {
    backgroundColor: "#4285F4",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  selectedFilterText: {
    color: "#fff",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for bottom navigation
  },
  tripCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  tripInfo: {
    padding: 16,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  tripStats: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
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
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
})

export default PreviousTrips

