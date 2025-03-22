import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from "expo-constants";
import * as SecureStore from 'expo-secure-store';

// React Query client instance
const queryClient = new QueryClient();

// Token management component
function TokenManager() {
  const { getToken } = useAuth();
  
  useEffect(() => {
    const storeToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          await SecureStore.setItemAsync('clerk-token', token);
        }
      } catch (error) {
        console.error('Error storing token:', error);
      }
    };

    storeToken();
  }, [getToken]);

  return null;
}

export default function RootLayout() {
  const router = useRouter();
  
  return (
    <ClerkProvider 
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      routerPush={(path: any) => router.push(path as any)}
      routerReplace={(path: any) => router.replace(path as any)}
    >
      <QueryClientProvider client={queryClient}>
        <TokenManager />
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
            name="auth-test"
            options={{ 
              title: "Auth Test",
              headerShown: true
            }}
          />
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
    </ClerkProvider>
  );
}
