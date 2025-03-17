import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const CreateTeam = () => {
  const [groupName, setGroupName] = useState('');
  const router = useRouter();

  const handleDone = () => {
    console.log('Group Name:', groupName);
    router.push({
      pathname: '/qrCode',
      params: { groupName }, // Ensure the key name matches what is expected in qrCode.tsx
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/bgimg.png')}
      style={styles.backgroundImage}
    >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Create Team</Text>
          <View style={styles.innerContainer}>
            <StatusBar style="inverted" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>Enter group name</Text>
              <TextInput
                style={styles.textBox}
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Group Name"
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
                <Text style={styles.doneButtonText}>Next</Text>
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
    backgroundColor: '#ece6f0',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    paddingHorizontal: 8,
    fontSize: 14,
    marginBottom: 10,
  },
  doneButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreateTeam;