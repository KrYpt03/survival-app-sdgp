"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  AppState,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import { Stack, router } from "expo-router"
import { X, Image as ImageIcon } from "lucide-react-native"
import { qrScannerService } from "../services/qrScannerService"
import React from "react"

const { width } = Dimensions.get("window")

export default function QRScannerScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [mediaPermission, setMediaPermission] = useState(false)
  const [scanning, setScanning] = useState(true)
  const [processing, setProcessing] = useState(false)
  const qrLock = useRef(false)
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    // Reset QR lock when app returns to foreground
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false
        setScanning(true)
      }
      appState.current = nextAppState
    })

    // Request media permissions
    ;(async () => {
      const mediaStatus = await MediaLibrary.requestPermissionsAsync()
      setMediaPermission(mediaStatus.status === "granted")
    })()

    return () => {
      subscription.remove()
    }
  }, [])

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (data && scanning && !qrLock.current) {
      qrLock.current = true
      setScanning(false)
      setProcessing(true)

      try {
        const result = await qrScannerService.processQRCode(data)
        handleScanResult(result)
      } catch (error) {
        console.error("Error processing QR code:", error)
        Alert.alert("Error", "Failed to process QR code. Please try again.")
      } finally {
        setTimeout(() => {
          setProcessing(false)
          setScanning(true)
          qrLock.current = false
        }, 2000)
      }
    }
  }

  const handleScanResult = async (result: any) => {
    if (result.success) {
      switch (result.type) {
        case "URL":
          // Handle URL type QR codes
          Alert.alert("URL Detected", `Do you want to open this URL?\n${result.url}`, [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open",
              onPress: async () => {
                const opened = await qrScannerService.openURL(result.url)
                if (!opened) {
                  Alert.alert("Error", "Could not open the URL")
                }
              },
            },
          ])
          break
        case "CHECK_IN":
          Alert.alert(
            "Check-in Successful",
            `You've checked in at ${"location" in result ? result.location : "an unknown location"}`,
          )
          break
        case "REWARD":
          if ("rewardName" in result) {
            Alert.alert("Reward Claimed", `You've claimed a ${result.rewardName}`)
          }
          break
        default:
          Alert.alert("QR Code Scanned", `Content: ${result.data || JSON.stringify(result)}`)
      }
    } else {
      Alert.alert("Error", result.message || "Unknown error occurred")
    }
  }

  const handleScanFromPhoto = async () => {
    if (!mediaPermission) {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission required", "Please grant access to your photo library")
        return
      }
    }

    try {
      const asset = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: "photo",
        sortBy: ["creationTime"],
      })

      if (asset.assets.length > 0) {
        setProcessing(true)
        try {
          const scanResult = await qrScannerService.processImageQRCode(asset.assets[0].uri)
          handleScanResult(scanResult)
        } catch (error) {
          console.error("Error processing image QR code:", error)
          Alert.alert("Error", "Failed to process QR code from image")
        } finally {
          setProcessing(false)
        }
      } else {
        Alert.alert("No images found", "Please select an image containing a QR code")
      }
    } catch (error) {
      console.error("Error accessing media library:", error)
      Alert.alert("Error", "Failed to access photo library")
    }
  }

  // If camera permission is not granted
  if (!cameraPermission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "QR Scanner", headerShown: false }} />
        <Text style={styles.text}>Camera permission is required to scan QR codes.</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: "QR Scanner", headerShown: false }} />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <X color="white" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.scannerContainer}>
            <View style={styles.scanner}>
              <View style={styles.scannerCorner} />
              <View style={[styles.scannerCorner, styles.topRight]} />
              <View style={[styles.scannerCorner, styles.bottomRight]} />
              <View style={[styles.scannerCorner, styles.bottomLeft]} />
            </View>
            <Text style={styles.scannerText}>Scan QR code</Text>
          </View>

          <TouchableOpacity style={styles.photoButton} onPress={handleScanFromPhoto} disabled={processing}>
            <ImageIcon color="white" size={20} />
            <Text style={styles.photoButtonText}>Scan from photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {processing && (
        <View style={styles.processingOverlay}>
          <Text style={styles.processingText}>Processing QR Code...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 20,
  },
  headerButton: {
    padding: 8,
  },
  scannerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanner: {
    width: width * 0.7,
    height: width * 0.7,
    position: "relative",
  },
  scannerCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: "white",
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderLeftWidth: 0,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderTopWidth: 0,
  },
  scannerText: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 40,
    alignSelf: "center",
  },
  photoButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  button: {
    backgroundColor: "#0E7AFE",
    padding: 12,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "white",
    fontSize: 18,
  },
})

