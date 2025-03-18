import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import SignUp from '../screens/SignUp';
import LoginScreen from '../screens/Loging';
import ForgotPassword from '../screens/ForgotPassword';
import Load from '../screens/Load';
import Profile from '../screens/Profile';
import GroupTrackingScreen from '../screens/GroupTrackingScreen';
import Home from '../screens/Home';
import VerifyEmailScreen from '../screens/VerifyEmail';
import ResetPasswordScreen from "../screens/ResetPassword";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
// If signed out users see Load Loging SignUp ForgotPassword
      <SignedOut>
        <Stack.Navigator initialRouteName='SignUp' id={undefined}>
        <Stack.Screen name="Load" component={Load} options={{ headerShown: false }} />
        <Stack.Screen name="Loging" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ headerShown: false }} /> 
        </Stack.Navigator>
      </SignedOut>

// If signed in users see Home Profile GroupTrackingScreen
      <SignedIn>
        <Stack.Navigator initialRouteName="Profile" id={undefined}>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="GroupTrackingScreen" component={GroupTrackingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </SignedIn>
    </NavigationContainer>
  );
}

