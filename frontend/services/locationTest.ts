import * as Location from "expo-location"
import { Alert, Platform } from "react-native"
import * as Linking from "expo-linking"

export const testLocationPermission = async () => {
  console.log("Testing location permission...")

  try {
    // Check current permission status
    const { status: currentStatus } = await Location.getForegroundPermissionsAsync()
    console.log("Current permission status:", currentStatus)

    if (currentStatus === "granted") {
      // We already have permission, try to get location
      console.log("Permission already granted, getting location...")
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      })
      console.log("Location obtained:", location)

      Alert.alert(
        "Location Test Successful",
        `Location permission is granted. Your coordinates are: 
        Latitude: ${location.coords.latitude.toFixed(4)}
        Longitude: ${location.coords.longitude.toFixed(4)}`,
      )
      return true
    } else {
      // Request permission
      console.log("Requesting permission...")
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync()
      console.log("New permission status:", newStatus)

      if (newStatus === "granted") {
        // Permission was just granted
        console.log("Permission granted, getting location...")
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
        console.log("Location obtained:", location)

        Alert.alert(
          "Location Test Successful",
          `Location permission was granted. Your coordinates are: 
          Latitude: ${location.coords.latitude.toFixed(4)}
          Longitude: ${location.coords.longitude.toFixed(4)}`,
        )
        return true
      } else {
        // Permission denied
        console.log("Permission denied")
        Alert.alert(
          "Location Permission Denied",
          "You need to grant location permission to use this feature. Would you like to open settings to enable it?",
          [
            { text: "Not Now", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:")
                } else {
                  Linking.openSettings()
                }
              },
            },
          ],
        )
        return false
      }
    }
  } catch (error) {
    console.error("Error testing location:", error)
    Alert.alert(
      "Location Error",
      `An error occurred while testing location: ${error instanceof Error ? error.message : String(error)}`,
    )
    return false
  }
}

