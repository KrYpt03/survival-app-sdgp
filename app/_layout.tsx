import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
        }}>
      <Stack.Screen 
        name="index"
      />
      </Stack>
    </View>
  );
}