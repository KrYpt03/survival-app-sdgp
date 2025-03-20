"use client";

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSignIn } from "@clerk/clerk-expo"; // Import Clerk
import React from "react";

const { width, height } = Dimensions.get("window");

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const { signIn, isLoaded } = useSignIn();
  
  const [code, setCode] = useState(""); // Code from email
  const [newPassword, setNewPassword] = useState(""); // New password

  // Function to verify reset code & update password
  const handleResetPassword = async () => {
    if (!isLoaded) return;

    if (!code || !newPassword) {
      Alert.alert("Error", "Please enter the verification code and a new password.");
      return;
    }

    try {
      // Verify the reset code and set new password
      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code, // The code from the email
        password: newPassword, // The new password
      });

      Alert.alert("Success", "Your password has been reset! Please log in.");
      navigation.navigate("Loging" as never); //Navigate to Login Screen
    } catch (err: any) {
      Alert.alert("Error", err.errors ? err.errors[0].message : "Password reset failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../../assets/882a1e39-7619-4d2d-8934-01ec2145083f.png")}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Enter Reset Code</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter Code"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    color: "#000",
  },
  resetButton: {
    backgroundColor: "#241c1c",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
