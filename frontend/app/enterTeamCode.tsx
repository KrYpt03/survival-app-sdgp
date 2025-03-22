import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

const enterTeamCode = () => {
  const [teamCode, setTeamCode] = useState('');
  const router = useRouter();
  const { userId } = useAuth();

  const joinTeamMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const response = await axios.post('https://trail-guard.onrender.com/api/team/join', {
        teamCode: teamCode.toUpperCase(),
        userId: userId,
      });
      return response.data;
    },
    onSuccess: (data) => {
      Alert.alert('Success', 'Successfully joined team!');
      router.push('/GroupTrackingScreen');
    },
    onError: (error: any) => {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to join team');
    },
  });

  const handleJoinTeam = () => {
    if (!teamCode.trim()) {
      Alert.alert('Error', 'Please enter a team code');
      return;
    }
    joinTeamMutation.mutate();
  };

  return (
    <ImageBackground
      source={require('../assets/images/882a1e39-7619-4d2d-8934-01ec2145083f.png')}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="inverted" />
        <Text style={styles.heading}>Join Team</Text>
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Enter Team Code</Text>
            <TextInput
              style={styles.textBox}
              value={teamCode}
              onChangeText={setTeamCode}
              placeholder="Team Code"
              placeholderTextColor="#aaa"
              autoCapitalize="characters"
              maxLength={8}
            />
            <TouchableOpacity 
              style={[
                styles.doneButton,
                joinTeamMutation.isPending && styles.disabledButton
              ]}
              onPress={handleJoinTeam}
              disabled={joinTeamMutation.isPending}
            >
              {joinTeamMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.doneButtonText}>Join</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#172621',
    marginBottom: 20,
  },
  innerContainer: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#1d1b20',
    marginBottom: 10,
  },
  textBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#fff',
    textTransform: 'uppercase',
  },
  doneButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default enterTeamCode;