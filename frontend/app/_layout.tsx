import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

// React Query client instance
const queryClient = new QueryClient();

// Enhanced token cache with error handling
const enhancedTokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Error getting token:", err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Error saving token:", err);
    }
  },
  async clearToken(key: string) {
    try {
      return await SecureStore.deleteItemAsync(key);
    } catch (err) {
      console.error("Error clearing token:", err);
    }
  }
};

function ClerkInitializer({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  
  // This component ensures any session-related errors during initialization 
  // are properly handled
  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      tokenCache={enhancedTokenCache}
    >
      {children}
    </ClerkProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkInitializer>
      <QueryClientProvider client={queryClient}>
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
          options={{}}
        />
        <Stack.Screen
          name="welcomeScreen"
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="Loging"
          options={{ title: "Loging" }}
        />
        <Stack.Screen
          name="SignUp"
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen
          name="activitiesBar"
          options={{ title: "Active" }}
        />
        <Stack.Screen
          name="imageScanner"
          options={{ title: "Active" }}
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
        <Stack.Screen
          name="enterTeamCode"
          options={{ title: "Enter Team Code" }}
        />
        <Stack.Screen
          name="kicked-screen"
          options={{ title: "Kicked Member" }}
        />
        <Stack.Screen
          name="reset-password"
          options={{ title: "Reset Password" }}
        />
      </Stack>
      </QueryClientProvider>
    </ClerkInitializer>
  );
}
