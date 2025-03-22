import 'dotenv/config';

export default {
  expo: {
    name: "Trail Guard",
    slug: "myApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/Logo2.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      qrApiBaseUrl: process.env.QR_API_BASE_URL,
      tripApiBaseUrl: process.env.TRIP_API_BASE_URL,
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      appEnv: process.env.APP_ENV || 'development',
      debug: process.env.DEBUG === 'true',
      eas: {
        projectId: process.env.EAS_PROJECT_ID
      }
    },
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to scan QR codes.",
        NSPhotoLibraryUsageDescription: "This app accesses your photos to scan QR codes from images."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ],
      package: "com.anonymous.myApp"
    },
    plugins: [
      "expo-router",
      ["expo-camera", {
        cameraPermission: "Allow $(PRODUCT_NAME) to access camera to scan QR codes."
      }],
      ["expo-barcode-scanner", {
        cameraPermission: "Allow $(PRODUCT_NAME) to access camera to scan QR codes."
      }],
      ["expo-media-library", {
        photosPermission: "Allow $(PRODUCT_NAME) to access your photos to scan QR codes from images.",
        savePhotosPermission: false,
        isAccessMediaLocationEnabled: false
      }],
      "expo-secure-store"
    ]
  }
}; 