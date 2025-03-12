import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Linking from "expo-linking"

const API_BASE_URL = "https://your-api-base-url.com/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to include the auth token
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

// Function to check if a string is a valid URL
const isValidURL = (str: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i",
  )
  return pattern.test(str)
}

export const qrScannerService = {
  processQRCode: async (qrData: string) => {
    try {
      // Check if the QR code contains a URL
      if (isValidURL(qrData)) {
        // If it's a URL, return a URL type result
        return {
          success: true,
          type: "URL",
          url: qrData,
        }
      }

      // For testing without an actual API
      if (qrData.includes("checkin:")) {
        const location = qrData.split("checkin:")[1]
        return {
          success: true,
          type: "CHECK_IN",
          location: location || "Unknown Location",
        }
      } else if (qrData.includes("reward:")) {
        const reward = qrData.split("reward:")[1]
        return {
          success: true,
          type: "REWARD",
          rewardName: reward || "Unknown Reward",
        }
      }

      // Actual API call when you're ready to connect to your backend
      // const response = await api.post("/qr-code/process", { qrData });
      // return response.data;

      // Return generic response for other types of QR codes
      return {
        success: true,
        type: "GENERIC",
        data: qrData,
      }
    } catch (error) {
      console.error("Error processing QR code:", error)
      return {
        success: false,
        message: "Failed to process QR code",
      }
    }
  },

  processImageQRCode: async (imageUri: string) => {
    try {
      const formData = new FormData()
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "qr_code_image.jpg",
      } as any)

      // For testing without an actual API
      // In a real app, this would be replaced with the API call below
      return {
        success: true,
        type: "GENERIC",
        data: "Image QR Code Result Placeholder",
      }

      // Actual API call
      // const response = await api.post("/qr-code/process-image", formData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      // return response.data;
    } catch (error) {
      console.error("Error processing image QR code:", error)
      return {
        success: false,
        message: "Failed to process QR code from image",
      }
    }
  },

  // Helper function to open URLs
  openURL: async (url: string) => {
    // Make sure the URL has a protocol
    let finalUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      finalUrl = "https://" + url
    }

    // Check if the URL can be opened
    const canOpen = await Linking.canOpenURL(finalUrl)
    if (canOpen) {
      await Linking.openURL(finalUrl)
      return true
    } else {
      console.error("Cannot open URL:", finalUrl)
      return false
    }
  },
}

