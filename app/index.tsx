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
      <Link href="/Loging">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Logging Page</Text>
      </Link>
      <Link href="/activitiesBar">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Active Bar Page</Text>
      </Link>
      <Link href="/imageScanner">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to image Scanner Page</Text>
      </Link>
      <Link href="/createTeam">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Create team Page</Text>
      </Link>
      <Link href="/QRScannerScreen">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to QR Scanner</Text>
      </Link>
      <Link href="/HomeScreen">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Home Page</Text>
      </Link>
      <Link href="/Profile">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Profile Page</Text>
      </Link>
      <Link href="/GroupTrackingScreen">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Group Tracking Page</Text>
      </Link>
    </View>
  );
}

export default Index;