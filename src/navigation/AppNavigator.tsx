import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from '../screens/SignUp';
import Loging from '../screens/Loging';
import ForgotPassword from '../screens/ForgotPassword';
import Load from '../screens/Load';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Load" id={undefined}>
        <Stack.Screen name="Load" component={Load} options={{ headerShown: false }} />
        <Stack.Screen name="Loging" component={Loging} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}