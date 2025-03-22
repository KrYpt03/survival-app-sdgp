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
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import NavigationBar from "../components/NavigationBar"
import { useRouter } from "expo-router"
import { Pencil, Check, X } from "lucide-react-native"
import { useAuth, useUser } from "@clerk/clerk-expo"
import React from "react"

const { width, height } = Dimensions.get("window")

// Define the profile interface
interface Profile {
  id: string
  name: string
  email: string
  bio: string
  phone: string
  location: string
  profileImage: string
  rewardPoints: number
  travelTrips: number
  bucketList: number
}

// Define the editable profile interface
interface EditableProfile {
  name?: string
  bio?: string
  phone?: string
  location?: string
  profileImage?: string
}

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editableProfile, setEditableProfile] = useState<EditableProfile>({})
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Get Clerk user data
  const { isLoaded: isAuthLoaded, isSignedIn, signOut } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()

  useEffect(() => {
    if (isAuthLoaded && isUserLoaded) {
      loadProfile()
    }
  }, [isAuthLoaded, isUserLoaded])

  const loadProfile = async () => {
    try {
      setLoading(true)

      if (!isSignedIn || !user) {
        throw new Error("User not authenticated")
      }

      // Get user data from Clerk
      const userData: Profile = {
        id: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User",
        email: user.primaryEmailAddress?.emailAddress || "",
        bio: (user.unsafeMetadata?.bio as string) || "Adventure enthusiast and nature lover",
        phone: user.phoneNumbers[0]?.phoneNumber || "+94 XXX XXX XXX",
        location: (user.unsafeMetadata?.location as string) || "Your Location",
        profileImage: user.imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
        // Default values for app-specific data
        rewardPoints: 1250,
        travelTrips: 15,
        bucketList: 8,
      }

      setProfile(userData)

      // Initialize editable profile with current values
      setEditableProfile({
        name: userData.name,
        bio: userData.bio,
        phone: userData.phone,
        location: userData.location,
        profileImage: userData.profileImage,
      })
    } catch (err) {
      setError("Failed to load profile")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    // Reset editable profile to current profile values
    if (profile) {
      setEditableProfile({
        name: profile.name,
        bio: profile.bio,
        phone: profile.phone,
        location: profile.location,
        profileImage: profile.profileImage,
      })
    }
    setIsEditing(false)
  }

  const handleSaveProfile = async () => {
    if (!profile || !user) return

    try {
      setIsSaving(true)

      // Check if any changes were made
      if (
        editableProfile.name === profile.name &&
        editableProfile.bio === profile.bio &&
        editableProfile.phone === profile.phone &&
        editableProfile.location === profile.location
      ) {
        // No changes were made
        setIsEditing(false)
        return
      }

      // Prepare the update data
      const updateData: any = {}

      // Only update firstName and lastName if name was changed
      if (editableProfile.name !== profile.name) {
        const nameParts = (editableProfile.name || "").trim().split(" ")
        updateData.firstName = nameParts[0] || ""
        updateData.lastName = nameParts.slice(1).join(" ") || ""
      }

      // Prepare metadata updates
      const metadata: any = { ...user.unsafeMetadata }

      if (editableProfile.bio !== profile.bio) {
        metadata.bio = editableProfile.bio
      }

      if (editableProfile.location !== profile.location) {
        metadata.location = editableProfile.location
      }

      // Only update metadata if changes were made
      if (Object.keys(metadata).length > 0) {
        updateData.unsafeMetadata = metadata
      }

      // Only make the API call if there are changes to update
      if (Object.keys(updateData).length > 0) {
        await user.update(updateData)

        console.log("Profile updated successfully with data:", updateData)
      }

      // Update phone number if changed and provided
      if (editableProfile.phone && editableProfile.phone !== profile.phone) {
        // In a real app, you would implement phone number verification here
        console.log("Phone number would be updated:", editableProfile.phone)
      }

      // Update local profile state
      setProfile({
        ...profile,
        name: editableProfile.name || profile.name,
        bio: editableProfile.bio || profile.bio,
        phone: editableProfile.phone || profile.phone,
        location: editableProfile.location || profile.location,
        profileImage: editableProfile.profileImage || profile.profileImage,
      })

      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully")
    } catch (err) {
      console.error("Failed to update profile:", err)
      Alert.alert("Error", "Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof EditableProfile, value: string) => {
    setEditableProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Define menu items inside the component to access router
  const menuItems = [
    // {
    //   title: "Profile",
    //   icon: require("../assets/images/profile/c18763fe-fd51-4541-ab35-e6b3f3a20705.png"),
    //   onPress: () => {},
    // },
    {
      title: "Bookmarked",
      icon: require("../assets/images/profile/742ef63e-eb0e-4b6d-ac71-268c589ac9eb.png"),
      onPress: () => {},
    },
    {
      title: "Previous Trips",
      icon: require("../assets/images/profile/880b7236-e0bd-4040-a4ec-156e305815ab.png"),
      onPress: () => router.push("/PreviousTrips"), // Navigate to PreviousTrips screen
    },
    {
      title: "Settings",
      icon: require("../assets/images/profile/4cb993d5-dda5-4e63-9f6d-075c8b4a71d4.png"),
      onPress: () => router.push("/settings"), // Navigate to settings screen (lowercase)
    },
    // {
    //   title: "Version",
    //   icon: require("../assets/images/profile/82255941-f9f9-4824-9d2b-8065fd791f18.png"),
    //   onPress: () => {},
    // },
  ]

  if (!isAuthLoaded || !isUserLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7029" />
      </View>
    )
  }

  if (!isSignedIn) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>You need to be signed in to view your profile</Text>
        <TouchableOpacity onPress={() => router.replace("/Loging")} style={styles.retryButton}>
          <Text style={styles.retryText}>Go to Login</Text>
        </TouchableOpacity>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
          <View style={styles.header}>
            <ImageBackground
              style={styles.menuIcon}
              source={require("../assets/images/profile/94fb0b4c-e9f2-4649-9c1e-804e113d65c2.png")}
              resizeMode="cover"
            />
            <Text style={styles.headerTitle}>Profile</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                <Pencil size={20} color="#1b1e28" />
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
                  <X size={20} color="#ff0000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} style={styles.saveButton} disabled={isSaving}>
                  <Check size={20} color="#00aa00" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <TouchableOpacity
              style={styles.profileImageContainer}
              onPress={() => isEditing && Alert.alert("Feature", "Change profile picture feature coming soon!")}
            >
              <ImageBackground style={styles.profileImage} source={{ uri: profile.profileImage }} resizeMode="cover" />
              {isEditing && (
                <View style={styles.editImageOverlay}>
                  <Text style={styles.editImageText}>Edit</Text>
                </View>
              )}
            </TouchableOpacity>

            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editableProfile.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Your Name"
              />
            ) : (
              <Text style={styles.profileName}>{profile.name}</Text>
            )}

            <Text style={styles.profileEmail}>{profile.email}</Text>

            {isEditing ? (
              <TextInput
                style={styles.bioInput}
                value={editableProfile.bio}
                onChangeText={(text) => handleInputChange("bio", text)}
                placeholder="Your Bio"
                multiline
              />
            ) : (
              <Text style={styles.profileBio}>{profile.bio}</Text>
            )}

            <View style={styles.contactInfo}>
              {isEditing ? (
                <TextInput
                  style={styles.contactInput}
                  value={editableProfile.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.contactText}>📱 {profile.phone}</Text>
              )}

              {isEditing ? (
                <TextInput
                  style={styles.contactInput}
                  value={editableProfile.location}
                  onChangeText={(text) => handleInputChange("location", text)}
                  placeholder="Location"
                />
              ) : (
                <Text style={styles.contactText}>📍 {profile.location}</Text>
              )}
            </View>
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
                  source={require("../assets/images/profile/e130046b-dc9c-4e6c-be94-bd3205bd974e.png")}
                  style={styles.menuArrow}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Add extra padding at the bottom to ensure all content is scrollable above the navigation bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading overlay when saving */}
      {isSaving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}

      <NavigationBar />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 50,
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
  editButton: {
    padding: 8,
  },
  editActions: {
    flexDirection: "row",
  },
  cancelButton: {
    padding: 8,
    marginRight: 8,
  },
  saveButton: {
    padding: 8,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editImageOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
  },
  editImageText: {
    color: "#ffffff",
    fontSize: 12,
  },
  notificationIcon: {
    width: 30,
    height: 30,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "500",
    color: "#1b1e28",
    marginTop: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "500",
    color: "#1b1e28",
    marginTop: 8,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 4,
    width: "80%",
  },
  profileEmail: {
    fontSize: 14,
    color: "#7c838d",
    marginTop: 4,
    marginBottom: 10,
  },
  profileBio: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    minHeight: 60,
  },
  contactInfo: {
    width: "100%",
    marginBottom: 15,
  },
  contactText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  contactInput: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
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
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  savingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 10,
  },
})
