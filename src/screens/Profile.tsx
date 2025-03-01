"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native"
import { profileAPI, type Profile } from "../api/profile"

const { width, height } = Dimensions.get("window")

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // In a real app, get token from secure storage
      const token = "mock-token"
      const data = await profileAPI.getProfile(token)
      setProfile(data)
    } catch (err) {
      setError("Failed to load profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7029" />
      </View>
    )
  }

  if (error || !profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Something went wrong"}</Text>
        <TouchableOpacity onPress={loadProfile} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.header}>
          <ImageBackground
            style={styles.menuIcon}
            source={require("../../assets/profile/94fb0b4c-e9f2-4649-9c1e-804e113d65c2.png")}
            resizeMode="cover"
          />
          <Text style={styles.headerTitle}>Profile</Text>
          <ImageBackground
            style={styles.notificationIcon}
            source={require("../../assets/profile/eb79a373-3494-4396-b204-cdc4bf5e15d9.png")}
          />
        </View>

        <View style={styles.profileInfo}>
          <ImageBackground
            style={styles.profileImage}
            source={require("../../assets/profile/9a893182-d17f-4cd1-92be-e15f7bc7d227.png")}
            resizeMode="cover"
          />
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Reward Points</Text>
              <Text style={styles.statValue}>{profile.rewardPoints}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Travel Trips</Text>
              <Text style={styles.statValue}>{profile.travelTrips}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Bucket List</Text>
              <Text style={styles.statValue}>{profile.bucketList}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
            >
              <ImageBackground source={item.icon} style={styles.menuIcon} resizeMode="cover" />
              <Text style={styles.menuText}>{item.title}</Text>
              <ImageBackground
                source={require("../../assets/profile/e130046b-dc9c-4e6c-be94-bd3205bd974e.png")}
                style={styles.menuArrow}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add extra padding at the bottom to ensure all content is scrollable above the navigation bar */}
        <View style={styles.bottomPadding} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    backgroundColor: "#ff7029",
    borderRadius: 8,
  },
  retryText: {
    color: "#ffffff",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b1e28",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 30,
  },
  notificationIcon: {
    width: 30,
    height: 30,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "500",
    color: "#1b1e28",
    marginTop: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: "#7c838d",
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    margin: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1b1e28",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff7029",
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#1b1e28",
  },
  menuArrow: {
    width: 24,
    height: 24,
  },
  bottomPadding: {
    height: 80, // Adjust this value based on the height of your navigation bar
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f3edf7",
    borderRadius: 25,
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
})

const menuItems = [
  {
    title: "Profile",
    icon: require("../../assets/profile/c18763fe-fd51-4541-ab35-e6b3f3a20705.png"),
    onPress: () => {},
  },
  {
    title: "Bookmarked",
    icon: require("../../assets/profile/742ef63e-eb0e-4b6d-ac71-268c589ac9eb.png"),
    onPress: () => {},
  },
  {
    title: "Previous Trips",
    icon: require("../../assets/profile/880b7236-e0bd-4040-a4ec-156e305815ab.png"),
    onPress: () => {},
  },
  {
    title: "Settings",
    icon: require("../../assets/profile/4cb993d5-dda5-4e63-9f6d-075c8b4a71d4.png"),
    onPress: () => {},
  },
  {
    title: "Version",
    icon: require("../../assets/profile/82255941-f9f9-4824-9d2b-8065fd791f18.png"),
    onPress: () => {},
  },
]

const navigationItems = [
  {
    icon: require("../../assets/profile/4757d4cc-108a-4570-8e32-ac0514f1c5b2.png"),
    onPress: () => {},
  },
  {
    icon: require("../../assets/profile/0d19fe1c-1a37-4dc8-a582-9441af5ef8c5.png"),
    onPress: () => {},
  },
  {
    icon: require("../../assets/profile/bd137700-8dc1-48fb-92c2-08643c077010.png"),
    onPress: () => {},
  },
  {
    icon: require("../../assets/profile/0415227a-9b94-4632-a21b-4c46d2f8432c.png"),
    onPress: () => {},
  },
  {
    icon: require("../../assets/profile/46f352d9-70f6-4c9e-886c-768bcf1746b8.png"),
    onPress: () => {},
  },
]

