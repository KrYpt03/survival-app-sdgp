import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import QRCode from 'react-native-qrcode-svg';
import { useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Function to generate a 9-digit code
const generate9DigitCode = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

const QRCodeScreen = () => {
  const { groupName } = useLocalSearchParams<{ groupName?: string }>();

  // Generate 9-digit code
  const generatedCode = generate9DigitCode();

  return (
    <ImageBackground
      source={require('../assets/images/bgimg.png')}
      style={styles.backgroundImage}
    >
      <StatusBar style="inverted" />
      <View style={styles.container}>

        <View style={styles.header}>
          {/* Display Group Name */}
          {groupName && <Text style={styles.groupName}>Group {groupName} </Text>}
          <MaterialIcons name="drive-file-rename-outline" size={35}/>
        </View>
        

        {/* Display QR Code */}
        {groupName && (
          <View style={styles.qrContainer}>
            <QRCode value={groupName} size={200} />
          </View>
        )}
        <Text style={styles.qrtitle}>Group Code</Text>

        {/* Display the 9-digit code with icon */}
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{generatedCode}</Text>
          <Feather style={styles.copyIconStyle} name="copy" size={24} />
        </View>

        
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.buttonText} >Start</Text>
        </TouchableOpacity>
        
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
});

export default QRCodeScreen;
