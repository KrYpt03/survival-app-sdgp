import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="welcomeScreen" 
        options={{
          title: "Welcome",
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="logging" 
        options={{
          title: "Login",
          headerTitleStyle: {
            color: '#7928CA'
          }
        }}
      />
      <Stack.Screen 
        name="activitiesBar" 
        options={{
          title: "Active",
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="imageScanner" 
        options={{
          title: "Active",
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="createTeam" 
        options={{
          title: "Active",
          headerShown: false
        }}
      />
      
    </Stack>
  );
}