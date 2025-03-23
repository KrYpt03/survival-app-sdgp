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
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import React from "react"

//import clerk authentication hooks
import {useSignIn, useAuth, useClerk} from "@clerk/clerk-expo";
// Import auth service
import { safeSignIn, clearAuthTokens } from "../services/authService";

const { width, height } = Dimensions.get("window")

export default function LoginScreen() {
  const navigation = useNavigation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Clerk Authentication Hooks
  const { signIn, setActive } = useSignIn();
  const { isLoaded } = useAuth();
  const { signOut } = useClerk();

  // Handle Login with Clerk Authentication
  const handleLogin = async () => {
    if (!isLoaded || !signIn) {
      console.error("Auth not loaded or signIn is undefined");
      return;
    }

    setIsLoading(true);

    try {
      // Clear tokens before trying to sign in (preemptive fix)
      await clearAuthTokens();
      
      // Use our safe sign-in function from authService
      const result = await safeSignIn(signIn, email, password, signOut);

      if (result.status === "complete") {
        // Set the active session and navigate to HomeScreen
        await setActive({ session: result.createdSessionId });
        navigation.navigate("HomeScreen" as never);
      } else {
        console.log("Login incomplete", result);
        Alert.alert("Login Error", "Sign in process was not completed. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed", 
        error.message || "Failed to sign in. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp" as never)
  }

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword" as never)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <ImageBackground
              source={require("../assets/images/3d462754-0e3e-47dd-b69b-705f9825ed43.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Trail Guard</Text>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <View style={styles.menuBar} />
            <View style={styles.menuBar} />
            <View style={styles.menuBar} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Log In</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#666"
            editable={!isLoading}
          />

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.disabledButton]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>LOG IN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.signUpButton, isLoading && styles.disabledButton]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
    paddingBottom: 100, // Add some padding at the bottom
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
  loginButton: {
    backgroundColor: "#241c1c",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    color: "#241c1c",
    fontSize: 18,
    fontWeight: "500",
  },
  forgotPassword: {
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },
})

