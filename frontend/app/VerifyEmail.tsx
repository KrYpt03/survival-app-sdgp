import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSignUp } from "@clerk/clerk-expo";
import React from "react";

const { width, height } = Dimensions.get("window");

export default function VerifyEmailScreen() {
  const navigation = useNavigation();
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");

  const handleVerify = async () => {
    try {
      if (!signUp) {
        console.error("signUp is undefined");
        return;
      }

      // Attempt to verify email
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        alert("Email verified successfully!");
        navigation.navigate("HomeScreen" as never);
      } else {
        console.log("Verification incomplete", result);
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      alert("Invalid or expired verification code.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png")} // Use the same background as Signup
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code sent to your email.</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
            <Text style={styles.verifyButtonText}>Verify</Text>
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
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 18,
    marginBottom: 16,
    color: "#000",
    width: "80%",
    textAlign: "center",
  },
  verifyButton: {
    backgroundColor: "#241c1c",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
    marginTop: 8,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

