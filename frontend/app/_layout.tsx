import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="welcomeScreen" 
        options={{
          title: "Welcome",
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="activitiesBar" 
        options={{
          title: "Active",
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="imageScanner" 
        options={{
          title: "Active",
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="createTeam" 
        options={{
          title: "Active",
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="qrCode" 
        options={{
          title: "Active",
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="analyzePage" 
        options={{
          title: "Active",
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}