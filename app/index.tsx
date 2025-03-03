import { View, Text } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

const Index = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Link href="/welcomeScreen">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Welcome Page</Text>
      </Link>
    </View>
  );
}

export default Index;

