"use client"

import React from "react"
import { useEffect } from "react"
import { View, Text, StyleSheet, ImageBackground, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get("window")

const KickedScreen: React.FC = () => {
  const navigation = useNavigation()

  useEffect(() => {
    // Automatically navigate back to home screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate("HomeScreen" as never)
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigation])

  return (
    <View style={styles.container}>
      <StatusBar style="inverted" />
      <ImageBackground
        source={require("../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          <Text style={styles.oopsText}>Oops...</Text>
          <Text style={styles.messageText}>You have been removed from the group</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: 320,
    padding: 20,
    backgroundColor: '#ece6f0',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    
  },
  oopsText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  messageText: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    lineHeight: 32,
  },
})

export default KickedScreen

