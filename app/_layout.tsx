import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React from "react";
import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo";

const CLERK_PUBLISHABLE_KEY = "pk_test_cmVuZXdlZC1ncm91c2UtNTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

// Create a secure token cache for Clerk (optional but recommended)
const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <Stack
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 200,
          contentStyle: { backgroundColor: 'white' }
        }}
      >
        <StatusBar style="inverted" />
        <Stack.Screen 
          name="index" 
          options={{ }}
        />
        <Stack.Screen 
          name="welcomeScreen" 
          options={{ title: "Welcome"}}
        />
        <Stack.Screen 
          name="Loging" 
          options={{ title: "Loging"}}
        />
        <Stack.Screen
          name="SignUp"
          options={{ title: "Sign Up"}}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ title: "Forgot Password"}}
        />
        <Stack.Screen 
          name="activitiesBar" 
          options={{ title: "Active"}}
        />
        <Stack.Screen 
          name="imageScanner" 
          options={{ title: "Active"}}
        />
        <Stack.Screen 
          name="createTeam" 
          options={{ title: "Active" }}
        />
        <Stack.Screen 
          name="Profile" 
          options={{ title: "Active" }}
        />
        <Stack.Screen 
          name="HomeScreen" 
          options={{ title: "Active" }}
        />
        <Stack.Screen 
          name="QRScannerScreen" 
          options={{ title: "Active" }}
        />
        <Stack.Screen
          name="GroupTrackingScreen"
          options={{ title: "Group Tracking" }}
        />
        <Stack.Screen
          name="PreviousTrips"
          options={{ title: "Previous Trips" }}
        />
        <Stack.Screen
          name="ResetPassword"
          options={{ title: "Reset Password" }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Settings" }}
        />
      </Stack>
    </ClerkProvider>
  );
}
