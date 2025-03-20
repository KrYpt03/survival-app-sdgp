import { ClerkProvider } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React from "react";
import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo";

const CLERK_PUBLISHABLE_KEY = "pk_test_cmVuZXdlZC1ncm91c2UtNTAuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={undefined}>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="welcomeScreen" 
          options={{ title: "Welcome", headerShown: false }}
        />
        <Stack.Screen 
          name="logging" 
          options={{ title: "Login", headerTitleStyle: { color: '#7928CA' }}}
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
      </Stack>
    </ClerkProvider>
  );
}