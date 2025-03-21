import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 200,
            contentStyle: { backgroundColor: 'white' }
          }}>
          <Stack.Screen 
            name="index"
          />
          <Stack.Screen
            name="imageScanner"
            options={{
              title: 'Scan', 
            }}
          />
          <Stack.Screen
            name="analyzePage"
            options={{
              title: 'Analyze', 
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
            }}
          />
        </Stack>
      </View>
    </SafeAreaView>
  );
}