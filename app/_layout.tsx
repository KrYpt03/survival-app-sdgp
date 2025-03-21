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
      <Stack>
        <StatusBar style="inverted" />
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="welcomeScreen" 
          options={{ title: "Welcome", headerShown: false }}
        />
        <Stack.Screen 
          name="Loging" 
          options={{ title: "Loging", headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          options={{ title: "Sign Up", headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ title: "Forgot Password", headerShown: false }}
        />
        <Stack.Screen 
          name="activitiesBar" 
          options={{ title: "Active", headerShown: false }}
        />
        <Stack.Screen 
          name="imageScanner" 
          options={{ title: "Active", headerShown: false }}
        />
        <Stack.Screen 
          name="createTeam" 
          options={{ title: "Active", headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          options={{ title: "Active", headerShown: false }}
        />
        <Stack.Screen 
          name="HomeScreen" 
          options={{ title: "Active", headerShown: false }}
        />
        <Stack.Screen 
          name="QRScannerScreen" 
          options={{ title: "Active", headerShown: false }}
        />
        <Stack.Screen
          name="GroupTrackingScreen"
          options={{ title: "Group Tracking", headerShown: false }}
        />
        <Stack.Screen
          name="PreviousTrips"
          options={{ title: "Previous Trips", headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          options={{ title: "Reset Password", headerShown: false }}
        />
        <Stack.Screen
          name="settings"
          options={{ title: "Settings", headerShown: false }}
        />
      </Stack>
    </ClerkProvider>
  );
}
