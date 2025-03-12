import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useState, useEffect } from "react";
import React from "react";

export default function Home() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = useState(false);
  
  useEffect(() => {
    (async () => {
      const mediaStatus = await MediaLibrary.getPermissionsAsync();
      requestMediaPermission(mediaStatus.status === "granted");
    })();
  }, []);

  const requestAllPermissions = async () => {
    // Request camera permission
    await requestCameraPermission();
    
    // Request media library permission
    const mediaStatus = await MediaLibrary.requestPermissionsAsync();
    requestMediaPermission(mediaStatus.status === "granted");
  };

  const isPermissionGranted = Boolean(cameraPermission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={{ gap: 20 }}>
        <Pressable onPress={requestAllPermissions}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        <Link href={"/QRScannerScreen"} asChild>
          <Pressable disabled={!isPermissionGranted}>
            <Text
              style={[
                styles.buttonStyle,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Scan Code
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
});