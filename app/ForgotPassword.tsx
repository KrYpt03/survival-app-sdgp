"use client"

import { useState } from "react"
import {
  View,
  Text,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import React from "react"

import { useSignIn } from "@clerk/clerk-expo"

const { width, height } = Dimensions.get("window")

export default function ForgotPasswordScreen() {
  const navigation = useNavigation()
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("")

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      if (!signIn) {
        console.error("signIn is undefined");
        return;
      }

      // Request password reset using Clerk API
      await signIn.create({
        identifier: email,
        strategy: "reset_password_email_code",
      });

      Alert.alert("Success", "Check your email for password reset instructions!");
      navigation.navigate("ResetPassword" as never);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      Alert.alert("Error", "Failed to request password reset. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ImageBackground
          style={styles.backgroundImage}
          source={require("../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
          resizeMode="cover"
        >
          <View style={styles.content}>
            <TouchableOpacity onPress={() => navigation.navigate("ResetPassword" as never)} style={styles.backButton}>
              <ImageBackground
                style={styles.backArrow}
                source={require("../assets/images/arrow-small-left.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Text style={styles.title}>Reset Password</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
              />
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
              <Text style={styles.resetButtonText}>REQUEST RESET</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginTop: 23,
    marginLeft: 10,
  },
  backArrow: {
    width: 29,
    height: 29,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginTop: 109,
    marginBottom: 28,
  },
  inputContainer: {
    marginBottom: 21,
  },
  input: {
    backgroundColor: "#f5f4f2",
    borderRadius: 31.5,
    height: 63,
    paddingHorizontal: 16,
    fontSize: 18,
    color: "#241c1c",
  },
  resetButton: {
    backgroundColor: "#241c1c",
    borderRadius: 31.5,
    height: 63,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#f5f4f2",
    fontSize: 18,
    fontWeight: "700",
  },
})

