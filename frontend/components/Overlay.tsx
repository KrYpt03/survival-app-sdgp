import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { X } from "lucide-react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export function Overlay() {
  return (
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
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 20,
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
});