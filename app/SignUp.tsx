"use client"

import { useState } from "react"
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import React from "react"

const { width, height } = Dimensions.get("window")

export default function SignupScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignUp = () => {
    console.log("Sign Up pressed with:", email, password)
    // Here you would typically call your sign-up API
    // For now, we'll just log the credentials
  }

  const handleLogin = () => {
    navigation.navigate("Loging" as never)// Here you would typically navigate to the main screen
  }

  const navigateToLogin = () => {
    navigation.navigate("Loging" as never)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoContainer} onPress={navigateToLogin}>
            <ImageBackground
              source={require("../assets/images/3d462754-0e3e-47dd-b69b-705f9825ed43.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Trail Guard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuBar} />
            <View style={styles.menuBar} />
            <View style={styles.menuBar} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 32,
    height: 32,
  },
  logoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
    marginLeft: 8,
  },
  menuButton: {
    padding: 8,
  },
  menuBar: {
    width: 24,
    height: 2,
    backgroundColor: "#345e40",
    marginVertical: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 42,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 18,
    marginBottom: 16,
    color: "#000",
  },
  signUpButton: {
    backgroundColor: "#241c1c",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "#241c1c",
    fontSize: 18,
    fontWeight: "500",
  },
})

