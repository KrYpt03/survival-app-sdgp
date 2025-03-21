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
      <Link href="/PreviousTrips">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Previous Trips Page</Text>
      </Link>
      <Link href="/ResetPassword">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Reset Password Page</Text>
      </Link>
      <Link href="/settings">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Settings Page</Text>
      </Link>
      <Link href="/enterTeamCode">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Enter Team Code</Text>
      </Link>
      <Link href="/kicked-screen">
        <Text style={{ color: 'blue', marginTop: 20 }}>Go to Kicked member</Text>
      </Link>
    </View>
  );
}

export default Index;