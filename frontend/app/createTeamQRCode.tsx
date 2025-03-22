import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@clerk/clerk-expo';
// import * as Clipboard from 'expo-clipboard'; // Uncomment this if you're using clipboard functionality

const QRCodeScreen = () => {
  const { groupName } = useLocalSearchParams<{ groupName?: string }>();
  const { userId } = useAuth();
  const range = 150; // Assume range in meters, should be passed or selected earlier

  const createTeamMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const response = await axios.post('http://192.168.8.104:3000/api/team', {
        teamName: groupName,
        range,
        userId: userId
      });
      return response.data;
    },
    onError: (error: any) => {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create team');
    },
  });

  useEffect(() => {
    if (groupName) {
      createTeamMutation.mutate();
    }
  }, [groupName]);

  if (createTeamMutation.isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{ color: 'white', marginTop: 10 }}>Creating Team...</Text>
      </View>
    );
  }

  const teamData = createTeamMutation.data;
  const teamCode = teamData?.teamCode;

  const qrCodeValue = JSON.stringify({
    groupName,
    code: teamCode,
  });

  return (
    <ImageBackground
      source={require('../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png')}
      style={styles.backgroundImage}
    >
      <StatusBar style="inverted" />
      <View style={styles.container}>
        <View style={styles.header}>
          {groupName && <Text style={styles.groupName}>Group {groupName}</Text>}
          <MaterialIcons name="drive-file-rename-outline" size={35} />
        </View>

        {teamCode && (
          <View style={styles.qrContainer}>
            <QRCode value={qrCodeValue} size={200} />
          </View>
        )}
        <Text style={styles.qrtitle}>Group Code</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{teamCode}</Text>
          <TouchableOpacity onPress={() => {
            console.log('Copying code:', teamCode);
            // Clipboard.setStringAsync(teamCode); // Uncomment if using Clipboard
          }}>
            <Feather style={styles.copyIconStyle} name="copy" size={24} />
          </TouchableOpacity>
        </View>
        <Link href="/GroupTrackingScreen" asChild>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        </Link>
        
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  groupName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  qrContainer: {
    marginTop: 10,
    padding: 30,
    backgroundColor: 'white',
    borderRadius: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  codeText: {
    fontSize: 25,
    color: 'white',
    marginRight: 10,
  },
  qrtitle: {
    fontSize: 20,
    color: 'white',
  },
  startButton: {
    backgroundColor: '#007aff',
    padding: 10,
    paddingHorizontal: 80,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  copyIconStyle: {
    color: 'white',
  },
  header: {
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCodeScreen;
